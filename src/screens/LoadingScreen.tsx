import { useEffect, useState } from 'react'

const FRAMES = ['M', 'Mod', 'Mooood', 'Mooood']
const FRAME_DURATIONS = [400, 400, 400, 600]

export default function LoadingScreen() {
  const [frame, setFrame] = useState(0)
  const [showSmile, setShowSmile] = useState(false)

  useEffect(() => {
    let current = 0

    function advance() {
      current += 1
      if (current < FRAMES.length) {
        setFrame(current)
        if (current === FRAMES.length - 1) {
          setTimeout(() => setShowSmile(true), 150)
        }
        setTimeout(advance, FRAME_DURATIONS[current])
      }
    }

    const t = setTimeout(advance, FRAME_DURATIONS[0])
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center"
      style={{ background: '#9CADFF' }}
    >
      <div className="flex flex-col items-center">
        <span
          className="font-chewy text-white"
          style={{ fontSize: 52, lineHeight: 1, transition: 'all 0.2s ease' }}
        >
          {FRAMES[frame]}
        </span>

        {/* Smile appears on last frame */}
        <svg
          viewBox="0 0 60 20"
          width="60"
          height="20"
          style={{
            marginTop: 6,
            opacity: showSmile ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          <path
            d="M8,4 Q30,22 52,4"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
    </div>
  )
}
