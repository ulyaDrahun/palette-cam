import { useEffect, useRef, useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import './App.css'


type HarmonyMode = 'analogous' | 'complementary' | 'monochromatic'

function App() {
  const [color, setColor] = useState('#d9c2a7')
  const [showPicker, setShowPicker] = useState(false)
  const [harmony, setHarmony] = useState<HarmonyMode>('analogous')

  const hexToHsl = (hex: string) => {
    const cleanHex = hex.replace('#', '')
  
    const r = parseInt(cleanHex.slice(0, 2), 16) / 255
    const g = parseInt(cleanHex.slice(2, 4), 16) / 255
    const b = parseInt(cleanHex.slice(4, 6), 16) / 255
  
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
  
    let h = 0
    let s = 0
    const l = (max + min) / 2
  
    if (max !== min) {
      const d = max - min
  
      s = d / (1 - Math.abs(2 * l - 1))
  
      if (max === r) {
        h = 60 * (((g - b) / d) % 6)
      } else if (max === g) {
        h = 60 * ((b - r) / d + 2)
      } else {
        h = 60 * ((r - g) / d + 4)
      }
    }
  
    return {
      h: (h + 360) % 360,
      s: s * 100,
      l: l * 100,
    }
  }
  
  const hslToHex = (h: number, s: number, l: number) => {
    s /= 100
    l /= 100
  
    const a = s * Math.min(l, 1 - l)
  
    const channel = (n: number) => {
      const k = (n + h / 30) % 12
      const value =
        l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
  
      return Math.round(255 * value)
        .toString(16)
        .padStart(2, '0')
    }
  
    return `#${channel(0)}${channel(8)}${channel(4)}`.toUpperCase()
  }

  


const makePalette = (baseColor: string, mode: HarmonyMode) => {
  const { h, s, l } = hexToHsl(baseColor)

  if (mode === 'analogous') {
    const offsets = [-40, -20, 0, 20, 40]

    return offsets.map((offset, index) => {
      if (index === 2) return baseColor.toUpperCase()

      const lightness = l + [12, 6, 0, -6, -12][index]
      const saturation = s * [0.75, 0.9, 1, 0.9, 0.75][index]

      return hslToHex(
        (h + offset + 360) % 360,
        Math.min(100, Math.max(0, saturation)),
        Math.min(90, Math.max(10, lightness))
      )
    })
  }

  if (mode === 'complementary') {
    const offsets = [-30, 0, 180, 150, 210]

    return offsets.map((offset, index) => {
      if (index === 1) return baseColor.toUpperCase()

      const newHue = (h + offset + 360) % 360
      const lightness = l + [12, 0, 0, 6, -6][index]
      const saturation = s * [0.8, 1, 1, 0.85, 0.85][index]

      return hslToHex(
        newHue,
        Math.min(100, Math.max(0, saturation)),
        Math.min(90, Math.max(10, lightness))
      )
    })
  }

  const lightnesses = [
    Math.min(92, l + 30),
    Math.min(85, l + 15),
    l,
    Math.max(15, l - 15),
    Math.max(8, l - 30),
  ]

  return lightnesses.map((lightness, index) => {
    if (index === 2) return baseColor.toUpperCase()

    return hslToHex(
      h,
      Math.min(100, Math.max(0, s * [0.7, 0.85, 1, 1, 0.9][index])),
      lightness
    )
  })
}

  

  //PALTTE CREATION

  const palette = makePalette(color, harmony)


  const [showCamera, setShowCamera] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!showCamera) return
  
    const startCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      })
  
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    }
  
    startCamera()
  }, [showCamera])

  const stopCamera = () => {
    const video = videoRef.current
    const stream = video?.srcObject as MediaStream | null
  
    stream?.getTracks().forEach((track) => track.stop())
  
    if (video) {
      video.srcObject = null
    }
  
    setShowCamera(false)
  }

  //Helper function rgb to Hex
  const rgbToHex = (r: number, g: number, b: number) => {
    return (
      '#' +
      [r, g, b]
        .map((value) => value.toString(16).padStart(2, '0'))
        .join('')
    )
  }

  //Clicking on screen - monitoring pixel
  const handleCameraClick = (
    event: React.MouseEvent<HTMLVideoElement>
  ) => {
    const video = videoRef.current
    const canvas = canvasRef.current
  
    if (!video || !canvas) return
  
    const rect = video.getBoundingClientRect()
  
    const clickX = event.clientX - rect.left
    const clickY = event.clientY - rect.top

    // Convert the mirrored screen position to the original video position.
    const displayX = clickX / rect.width
    const displayY = clickY / rect.height

    const x = Math.floor((1 - displayX) * video.videoWidth)
    const y = Math.floor(displayY * video.videoHeight)
  
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
  
    const context = canvas.getContext('2d')
  
    if (!context) return
  
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
  
    const pixel = context.getImageData(x, y, 1, 1).data

    const [r, g, b] = pixel

    const hex = rgbToHex(r, g, b)

    console.log('Pixel:', pixel)
    console.log('HEX:', hex)

    setColor(hex)
  }

  return (
    <main>
      <h1>Palette Cam</h1>
      <p>Find colors that work together.</p>

      <section className="color-picker">
      <div
        className="color-preview"
        style={{ backgroundColor: color }}
      ></div>

      <p className="hex-label">{color.toUpperCase()}</p>
        {showPicker && (
          <div className="picker-container">
            <HexColorPicker color={color} onChange={setColor} />

            <label htmlFor="hex-input">HEX</label>

            <input
              id="hex-input"
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="#D9C2A7"
            />

            <button
              className="done-button"
              onClick={() => setShowPicker(false)}
            >
              Done
            </button>
          </div>
        )}

      <div className="color-actions">
        <button
          className="pick-button"
          onClick={() => setShowPicker(!showPicker)}
        >
          Pick Colour
        </button>

        <button
          className="camera-button"
          onClick={() => setShowCamera(true)}
        >
          Colour Cam
        </button>
      </div>

      {showCamera && (
        <div className="camera-container">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            onClick={handleCameraClick}
          />
          <canvas ref={canvasRef}></canvas>
              <button
          className="done-button"
          onClick={stopCamera}
        >
          Done
        </button>
        </div>
      )}
      </section>

      <section>
      <h2>Your palette</h2>
      

        <div className="palette">
          {palette.map((paletteColor) => (
            <div className="palette-item" key={paletteColor}>
              <div
                className="palette-color"
                style={{ backgroundColor: paletteColor }}
              ></div>

              <span className="hex-label">
                {paletteColor.toUpperCase()}
              </span>

              
            </div>
          ))}
          
        </div>
        <div className="harmony-options">
      <button onClick={() => setHarmony('analogous')}>
          Analogous
        </button>

        <button onClick={() => setHarmony('complementary')}>
          Complementary
        </button>

        <button onClick={() => setHarmony('monochromatic')}>
          Monochromatic
        </button>
      </div>
      </section>
    </main>
  )
}

export default App