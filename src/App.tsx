import { useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import './App.css'

function App() {
  const [color, setColor] = useState('#d9c2a7')
  const [showPicker, setShowPicker] = useState(false)

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
        <button className="pick-button"
          onClick = {()=> setShowPicker(!showPicker)}>
          Pick Colour
        </button>

        <button className="camera-button">
          Colour Cam
        </button>
      </div>
      </section>

      <section> 
        <h2>Your palette</h2>

        <div className="palette">

          <div className="palette-item">
            <div
              className="palette-color"
              style={{ backgroundColor: '#A8B5A2' }}
            ></div>
            <span className="hex-label">#A8B5A2</span>
          </div>

          <div className="palette-item">
            <div
              className="palette-color"
              style={{ backgroundColor: '#C5D5B4' }}
            ></div>
            <span className="hex-label">#C5D5B4</span>
          </div>

          <div className="palette-item">
            <div
              className="palette-color"
              style={{ backgroundColor: '#E3E8D8' }}
            ></div>
            <span className="hex-label">#E3E8D8</span>
          </div>

          <div className="palette-item">
            <div
              className="palette-color"
              style={{ backgroundColor: '#8A9A7B' }}
            ></div>
            <span className="hex-label">#8A9A7B</span>
          </div>

          <div className="palette-item">
            <div
              className="palette-color"
              style={{ backgroundColor: '#5F7054' }}
            ></div>
            <span className="hex-label">#5F7054</span>
          </div>

        </div>
      </section>
    </main>
  )
}

export default App