import { useEffect, useRef } from "react";

interface Attack {
  x: number
  y: number
  type: string
}

export default function ARAttackVisualizer() {

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const attacks = useRef<Attack[]>([])

  useEffect(() => {

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = 400

    const server = {
      x: canvas.width / 2,
      y: canvas.height / 2
    }

    const generateAttack = () => {

      const side = Math.floor(Math.random() * 4)

      let x = 0
      let y = 0

      if (side === 0) {
        x = Math.random() * canvas.width
        y = 0
      }

      if (side === 1) {
        x = canvas.width
        y = Math.random() * canvas.height
      }

      if (side === 2) {
        x = Math.random() * canvas.width
        y = canvas.height
      }

      if (side === 3) {
        x = 0
        y = Math.random() * canvas.height
      }

      attacks.current.push({
        x,
        y,
        type: ["SQLi", "XSS", "DDoS"][Math.floor(Math.random() * 3)]
      })

    }

    const draw = () => {

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // draw server
      ctx.beginPath()
      ctx.arc(server.x, server.y, 15, 0, Math.PI * 2)
      ctx.fillStyle = "cyan"
      ctx.fill()

      ctx.fillStyle = "white"
      ctx.fillText("SERVER", server.x - 20, server.y + 30)

      attacks.current.forEach(a => {

        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(server.x, server.y)

        ctx.strokeStyle = "red"
        ctx.lineWidth = 2
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(a.x, a.y, 5, 0, Math.PI * 2)
        ctx.fillStyle = "orange"
        ctx.fill()

        ctx.fillStyle = "white"
        ctx.fillText(a.type, a.x + 5, a.y + 5)

      })

    }

    const attackInterval = setInterval(generateAttack, 2000)

    const renderLoop = () => {
      draw()
      requestAnimationFrame(renderLoop)
    }

    renderLoop()

    return () => {
      clearInterval(attackInterval)
    }

  }, [])

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Live Cyber Attack Visualization</h3>
      <canvas ref={canvasRef} style={{ border: "1px solid #333" }} />
    </div>
  )

}