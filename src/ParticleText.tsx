import { useEffect, useRef } from "react"
import "./ParticleText.css"

export interface TextSegment {
  text: string
  color?: string
}

export type TextLine = string | TextSegment[]

export interface ParticleTextProps {
  text?: string
  lines?: TextLine[]
  particleSize?: number
  density?: number
  color?: string
  highlightColor?: string
  scatter?: number
  gatherDuration?: number
  stagger?: number
  pointerRepel?: number
  repelRadius?: number
  idleDrift?: number
  trigger?: "mount" | "hover" | "click"
  fontSize?: number | string
  fontWeight?: number | string
  fontFamily?: string
  letterSpacing?: string
  lineHeight?: number
  textAlign?: "left" | "center" | "right"
  verticalAlign?: "top" | "middle" | "bottom"
  glow?: boolean
  className?: string
  style?: React.CSSProperties
}

interface RGB {
  r: number
  g: number
  b: number
}

interface Particle {
  x: number
  y: number
  startX: number
  startY: number
  targetX: number
  targetY: number
  size: number
  color: string
  seed: number
  depth: number
  delay: number
}

const hexToRgb = (hex: string): RGB | null => {
  const clean = hex.replace("#", "").trim()
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  }
}

const mixRgb = (from: RGB, to: RGB, amount: number): RGB => ({
  r: Math.round(from.r + (to.r - from.r) * amount),
  g: Math.round(from.g + (to.g - from.g) * amount),
  b: Math.round(from.b + (to.b - from.b) * amount),
})

const rgbToCss = (rgb: RGB) => `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

const resolveFontSize = (
  value: number | string,
  container: HTMLElement,
  fontWeight: number | string,
  fontFamily: string,
) => {
  if (typeof value === "number") return value

  const probe = document.createElement("span")
  probe.textContent = "M"
  probe.style.position = "absolute"
  probe.style.visibility = "hidden"
  probe.style.pointerEvents = "none"
  probe.style.fontSize = value
  probe.style.fontWeight = String(fontWeight)
  probe.style.fontFamily = fontFamily
  container.appendChild(probe)
  const size = parseFloat(window.getComputedStyle(probe).fontSize) || 96
  probe.remove()
  return size
}

const waitForFonts = async (font: string) => {
  if (!("fonts" in document)) return

  try {
    await document.fonts.load(font)
  } catch {}

  await document.fonts.ready
}

export default function ParticleText({
  text = "React Bits",
  lines,
  particleSize = 2,
  density = 4,
  color = "#ffffff",
  highlightColor = "#8b5cf6",
  scatter = 180,
  gatherDuration = 1600,
  stagger = 420,
  pointerRepel = 40,
  repelRadius = 120,
  idleDrift = 0.7,
  trigger = "mount",
  fontSize = "clamp(3rem, 12vw, 8rem)",
  fontWeight = 800,
  fontFamily = "inherit",
  letterSpacing,
  lineHeight = 0.85,
  textAlign = "center",
  verticalAlign = "middle",
  glow = true,
  className = "",
  style,
}: ParticleTextProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return undefined

    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return undefined

    const ctx = canvas.getContext("2d")
    if (!ctx) return undefined

    let particles: Particle[] = []
    let animationFrame: number | null = null
    let resizeFrame: number | null = null
    let buildId = 0
    let gathering = false
    let gatherStart = 0
    let reducedMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
    let width = 0
    let height = 0
    let dpr = 1

    const pointer = {
      active: false,
      x: 0,
      y: 0,
      smoothX: 0,
      smoothY: 0,
    }

    const startGather = (fromScatter = true) => {
      if (!particles.length) return

      const now = performance.now()
      const spread = reducedMotion ? 0 : scatter

      particles.forEach((particle) => {
        if (fromScatter) {
          const angle = particle.seed * Math.PI * 2
          const distance = spread * (0.35 + particle.depth * 0.75)
          particle.x =
            particle.targetX +
            Math.cos(angle) * distance +
            (particle.depth - 0.5) * spread * 0.55
          particle.y =
            particle.targetY +
            Math.sin(angle) * distance +
            (particle.seed - 0.5) * spread * 0.55
        }

        particle.startX = particle.x
        particle.startY = particle.y
        particle.delay = reducedMotion ? 0 : particle.seed * stagger
      })

      gatherStart = now
      gathering = true
    }

    const drawParticle = (particle: Particle) => {
      const size = particle.size
      ctx.fillStyle = particle.color

      if (size <= 2.1) {
        ctx.fillRect(particle.x - size / 2, particle.y - size / 2, size, size)
        return
      }

      ctx.beginPath()
      ctx.arc(particle.x, particle.y, size / 2, 0, Math.PI * 2)
      ctx.fill()
    }

    let inView = true

    const render = (now: number) => {
      if (!inView) {
        animationFrame = null
        return
      }
      ctx.clearRect(0, 0, width, height)

      if (glow && !reducedMotion) {
        ctx.shadowBlur = particleSize * 3
        ctx.shadowColor = highlightColor
      } else {
        ctx.shadowBlur = 0
      }

      pointer.smoothX += (pointer.x - pointer.smoothX) * 0.18
      pointer.smoothY += (pointer.y - pointer.smoothY) * 0.18

      let complete = true

      particles.forEach((particle) => {
        let baseX = particle.targetX
        let baseY = particle.targetY
        let progress = 1

        if (gathering) {
          const local =
            (now - gatherStart - particle.delay) /
            Math.max(1, reducedMotion ? 1 : gatherDuration)
          progress = clamp(local, 0, 1)
          const eased = easeOutCubic(progress)
          baseX = particle.startX + (particle.targetX - particle.startX) * eased
          baseY = particle.startY + (particle.targetY - particle.startY) * eased
          if (progress < 1) complete = false
        } else if (!reducedMotion && idleDrift > 0) {
          const driftTime = now * 0.001
          baseX +=
            Math.sin(driftTime * 0.9 + particle.seed * 10) *
            idleDrift *
            particle.depth
          baseY +=
            Math.cos(driftTime * 0.75 + particle.depth * 10) *
            idleDrift *
            particle.depth
        }

        if (
          pointer.active &&
          !reducedMotion &&
          pointerRepel > 0 &&
          repelRadius > 0
        ) {
          const dx = baseX - pointer.smoothX
          const dy = baseY - pointer.smoothY
          const distance = Math.hypot(dx, dy)
          if (distance > 0 && distance < repelRadius) {
            const force = Math.pow(1 - distance / repelRadius, 2) * pointerRepel
            baseX += (dx / distance) * force
            baseY += (dy / distance) * force
          }
        }

        const follow = reducedMotion ? 1 : 0.22
        particle.x += (baseX - particle.x) * follow
        particle.y += (baseY - particle.y) * follow

        ctx.globalAlpha = clamp(0.35 + progress * 0.65, 0, 1)
        drawParticle(particle)
      })

      ctx.globalAlpha = 1
      ctx.shadowBlur = 0

      if (gathering && complete) {
        gathering = false
      }

      animationFrame = window.requestAnimationFrame(render)
    }

    const ensureRenderLoop = () => {
      if (animationFrame === null) {
        animationFrame = window.requestAnimationFrame(render)
      }
    }

    const sampleText = async () => {
      const currentBuild = ++buildId
      const rect = container.getBoundingClientRect()
      width = Math.floor(rect.width)
      height = Math.floor(rect.height)

      if (width <= 0 || height <= 0) return

      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      canvas.style.width = "100%"
      canvas.style.height = "100%"
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const computed = window.getComputedStyle(container)
      const resolvedFamily =
        fontFamily === "inherit"
          ? computed.fontFamily || "sans-serif"
          : fontFamily
      let resolvedSize = resolveFontSize(
        fontSize,
        container,
        fontWeight,
        resolvedFamily,
      )
      let font = `${fontWeight} ${resolvedSize}px ${resolvedFamily}`

      await waitForFonts(font)
      if (currentBuild !== buildId) return

      const offscreen = document.createElement("canvas")
      const offCtx = offscreen.getContext("2d", { willReadFrequently: true })
      if (!offCtx) return

      offCtx.font = font
      if (letterSpacing) {
        try {
          ;(offCtx as unknown as { letterSpacing: string }).letterSpacing =
            letterSpacing
        } catch {}
      }

      // Normalize lines: support either lines array with custom segments or text string
      const normalizedLines: TextSegment[][] =
        lines && lines.length > 0
          ? lines.map((line) => {
              if (typeof line === "string") {
                return [{ text: line, color }]
              }
              return line.map((seg) => ({
                text: seg.text,
                color: seg.color || color,
              }))
            })
          : String(text || " ")
              .split("\n")
              .map((lineStr) => [{ text: lineStr, color }])

      // Calculate max line width
      let maxLineWidth = Math.max(
        1,
        ...normalizedLines.map((lineSegs) => {
          let lw = 0
          for (const seg of lineSegs) {
            lw += offCtx.measureText(seg.text).width
          }
          return lw
        }),
      )

      // Fit within maxTextWidth if needed
      const maxTextWidth = width * 0.98
      if (maxLineWidth > maxTextWidth) {
        resolvedSize = Math.max(
          16,
          resolvedSize * (maxTextWidth / maxLineWidth),
        )
        font = `${fontWeight} ${resolvedSize}px ${resolvedFamily}`
        await waitForFonts(font)
        if (currentBuild !== buildId) return
        offCtx.font = font
        if (letterSpacing) {
          try {
            ;(offCtx as unknown as { letterSpacing: string }).letterSpacing =
              letterSpacing
          } catch {}
        }
        maxLineWidth = Math.max(
          1,
          ...normalizedLines.map((lineSegs) => {
            let lw = 0
            for (const seg of lineSegs) {
              lw += offCtx.measureText(seg.text).width
            }
            return lw
          }),
        )
      }

      const sampleMetrics = offCtx.measureText("Mgy")
      const ascent = Math.ceil(
        sampleMetrics.actualBoundingBoxAscent || resolvedSize * 0.78,
      )
      const descent = Math.ceil(
        sampleMetrics.actualBoundingBoxDescent || resolvedSize * 0.22,
      )
      const lineStep = resolvedSize * lineHeight
      const numLines = normalizedLines.length
      const totalTextHeight = ascent + (numLines - 1) * lineStep + descent
      const padding = Math.max(12, Math.ceil(resolvedSize * 0.08))

      offscreen.width = Math.ceil(maxLineWidth + padding * 2)
      offscreen.height = Math.ceil(totalTextHeight + padding * 2)

      offCtx.clearRect(0, 0, offscreen.width, offscreen.height)
      offCtx.font = font
      if (letterSpacing) {
        try {
          ;(offCtx as unknown as { letterSpacing: string }).letterSpacing =
            letterSpacing
        } catch {}
      }
      offCtx.textAlign = "left"
      offCtx.textBaseline = "alphabetic"

      // Render lines on offscreen canvas
      for (let i = 0; i < normalizedLines.length; i++) {
        const lineSegs = normalizedLines[i]
        const lineY = padding + ascent + i * lineStep
        let lineX = padding

        for (const seg of lineSegs) {
          offCtx.fillStyle = seg.color || color
          offCtx.fillText(seg.text, lineX, lineY)
          lineX += offCtx.measureText(seg.text).width
        }
      }

      const imageData = offCtx.getImageData(
        0,
        0,
        offscreen.width,
        offscreen.height,
      )

      interface Target {
        x: number
        y: number
        alpha: number
        color?: string
      }

      const targets: Target[] = []
      const step = Math.max(2, Math.floor(density))

      let originX = width / 2 - offscreen.width / 2
      if (textAlign === "left") {
        originX = -padding
      } else if (textAlign === "right") {
        originX = width - offscreen.width + padding
      }

      let originY = height / 2 - offscreen.height / 2
      if (verticalAlign === "top") {
        originY = -padding
      } else if (verticalAlign === "bottom") {
        originY = height - offscreen.height + padding
      }

      for (let y = 0; y < offscreen.height; y += step) {
        for (let x = 0; x < offscreen.width; x += step) {
          const idx = (y * offscreen.width + x) * 4
          const alpha = imageData.data[idx + 3]
          if (alpha > 40) {
            const r = imageData.data[idx]
            const g = imageData.data[idx + 1]
            const b = imageData.data[idx + 2]
            targets.push({
              x: originX + x,
              y: originY + y,
              alpha: alpha / 255,
              color: rgbToCss({ r, g, b }),
            })
          }
        }
      }

      const maxParticles = Math.max(
        600,
        Math.min(1800, Math.floor((width * height) / 120)),
      )
      const stride = Math.max(1, Math.ceil(targets.length / maxParticles))
      const baseRgb = hexToRgb(color)
      const highlightRgb = hexToRgb(highlightColor)
      const selected = targets.filter((_, index) => index % stride === 0)

      particles = selected.map((target, index) => {
        const seed = ((index * 9301 + 49297) % 233280) / 233280
        const depth = 0.45 + (((index * 233 + 97) % 1000) / 1000) * 0.9
        const blend =
          baseRgb && highlightRgb
            ? clamp(target.x / Math.max(1, width) + (seed - 0.5) * 0.35, 0, 1)
            : 0
        const defaultColor =
          baseRgb && highlightRgb
            ? rgbToCss(mixRgb(baseRgb, highlightRgb, blend))
            : color
        const particleColor = target.color || defaultColor
        const angle = seed * Math.PI * 2
        const distance = (reducedMotion ? 0 : scatter) * (0.35 + depth * 0.75)
        const startX =
          target.x + Math.cos(angle) * distance + (seed - 0.5) * scatter * 0.45
        const startY =
          target.y + Math.sin(angle) * distance + (depth - 0.9) * scatter * 0.45

        return {
          x: reducedMotion ? target.x : startX,
          y: reducedMotion ? target.y : startY,
          startX,
          startY,
          targetX: target.x,
          targetY: target.y,
          size: Math.max(0.6, particleSize * (0.75 + target.alpha * 0.45)),
          color: particleColor,
          seed,
          depth,
          delay: seed * stagger,
        }
      })

      pointer.x = width / 2
      pointer.y = height / 2
      pointer.smoothX = pointer.x
      pointer.smoothY = pointer.y

      if (reducedMotion) {
        particles.forEach((particle) => {
          particle.x = particle.targetX
          particle.y = particle.targetY
          particle.startX = particle.targetX
          particle.startY = particle.targetY
          particle.delay = 0
        })
        gathering = false
      } else {
        startGather(false)
      }

      ensureRenderLoop()
    }

    const queueSample = () => {
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame)
      resizeFrame = window.requestAnimationFrame(sampleText)
    }

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
      pointer.active = true
    }

    const handlePointerLeave = () => {
      pointer.active = false
    }

    const handlePointerEnter = (event: PointerEvent) => {
      handlePointerMove(event)
      if (trigger === "hover") startGather(true)
    }

    const handleClick = () => {
      if (trigger === "click") startGather(true)
    }

    const reduceMotionQuery = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    )
    const handleReduceMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches
      sampleText()
    }

    reduceMotionQuery?.addEventListener("change", handleReduceMotionChange)
    canvas.addEventListener("pointerenter", handlePointerEnter)
    canvas.addEventListener("pointermove", handlePointerMove)
    canvas.addEventListener("pointerleave", handlePointerLeave)
    canvas.addEventListener("click", handleClick)

    const resizeObserver = new ResizeObserver(queueSample)
    resizeObserver.observe(container)

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        if (inView) {
          ensureRenderLoop()
        } else if (animationFrame !== null) {
          window.cancelAnimationFrame(animationFrame)
          animationFrame = null
        }
      },
      { threshold: 0.05 },
    )
    io.observe(container)

    sampleText()

    return () => {
      buildId += 1
      io.disconnect()
      resizeObserver.disconnect()
      reduceMotionQuery?.removeEventListener("change", handleReduceMotionChange)
      canvas.removeEventListener("pointerenter", handlePointerEnter)
      canvas.removeEventListener("pointermove", handlePointerMove)
      canvas.removeEventListener("pointerleave", handlePointerLeave)
      canvas.removeEventListener("click", handleClick)

      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame)
      if (resizeFrame !== null) window.cancelAnimationFrame(resizeFrame)
    }
  }, [
    text,
    lines,
    particleSize,
    density,
    color,
    highlightColor,
    scatter,
    gatherDuration,
    stagger,
    pointerRepel,
    repelRadius,
    idleDrift,
    trigger,
    fontSize,
    fontWeight,
    fontFamily,
    letterSpacing,
    lineHeight,
    textAlign,
    verticalAlign,
    glow,
  ])

  const screenReaderText =
    lines && lines.length > 0
      ? lines
          .map((line) =>
            typeof line === "string" ? line : line.map((s) => s.text).join(""),
          )
          .join(" ")
      : text

  return (
    <div
      ref={containerRef}
      className={`particle-text ${className}`}
      style={style}
      aria-label={screenReaderText}
    >
      <canvas
        ref={canvasRef}
        className="particle-text__canvas"
        aria-hidden="true"
      />
      <span className="particle-text__sr">{screenReaderText}</span>
    </div>
  )
}
