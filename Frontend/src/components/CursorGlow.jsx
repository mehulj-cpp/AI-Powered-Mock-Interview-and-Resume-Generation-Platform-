import { useEffect } from "react"

/**
 * Renders a single fixed, full-viewport layer (`.cursor-glow`) that holds a
 * radial gradient. A pointer-move listener eases the gradient's centre toward
 * the cursor by writing `--cursor-x` / `--cursor-y` on the document root, which
 * the `.cursor-glow` layer (see style.css) consumes. The easing gives the glow
 * a smooth, trailing feel rather than snapping to the pointer.
 *
 * Mounted once at the app root so the effect is uniform across every page.
 * Honors `prefers-reduced-motion` and ignores touch input.
 */
const CursorGlow = () => {
  useEffect(() => {
    const root = document.documentElement
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight / 2
    let curX = targetX
    let curY = targetY
    let raf = 0
    let running = false

    const write = (x, y) => {
      root.style.setProperty("--cursor-x", `${x}px`)
      root.style.setProperty("--cursor-y", `${y}px`)
    }

    const render = () => {
      curX += (targetX - curX) * 0.16
      curY += (targetY - curY) * 0.16
      write(curX, curY)
      if (Math.abs(targetX - curX) > 0.5 || Math.abs(targetY - curY) > 0.5) {
        raf = requestAnimationFrame(render)
      } else {
        running = false
      }
    }

    const start = () => {
      if (!running) {
        running = true
        raf = requestAnimationFrame(render)
      }
    }

    const onMove = (e) => {
      if (e.pointerType === "touch") return
      targetX = e.clientX
      targetY = e.clientY
      if (reduce) {
        curX = targetX
        curY = targetY
        write(curX, curY)
      } else {
        start()
      }
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    return () => {
      window.removeEventListener("pointermove", onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <div className="cursor-glow" aria-hidden="true" />
}

export default CursorGlow
