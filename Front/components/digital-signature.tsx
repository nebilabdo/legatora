'use client'

import { useRef, useEffect, useState } from 'react'
import { Button } from './ui/button'

interface DigitalSignatureProps {
  onSign?: (dataUrl: string) => void
  label?: string
}

export function DigitalSignature({ onSign, label = 'Digital Signature' }: DigitalSignatureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isSigned, setIsSigned] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDrawing(true)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.lineWidth = 1.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.globalAlpha = 0.7
    ctx.strokeStyle = '#4a5568'
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.globalAlpha = 1
    setIsSigned(true)
  }

  const endDrawing = () => {
    setIsDrawing(false)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setIsSigned(false)
  }

  const handleSign = () => {
    if (isSigned && canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png')
      onSign?.(dataUrl)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-3">{label}</label>
        <canvas
          ref={canvasRef}
          width={400}
          height={200}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          className="w-full border-2 border-dashed border-border rounded-lg cursor-crosshair bg-white"
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          onClick={clearSignature}
          disabled={!isSigned}
          className="text-sm"
        >
          Clear
        </Button>
        <Button
          onClick={handleSign}
          disabled={!isSigned}
          className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
        >
          Sign
        </Button>
      </div>
    </div>
  )
}
