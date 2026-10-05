import { useEffect, useRef, useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import './App.css'



function App() {
  const [color, setColor] = useState('#d9c2a7')
  const [showPicker, setShowPicker] = useState(false)
  const palette = [
    '#5F7054',
    '#8A9A7B',
    color,
    '#C5D5B4',
    '#E3E8D8',
  ]
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
  
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
  
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
      </section>
    </main>
  )
}

export default App