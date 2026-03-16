import { Calendar, User, Plus } from 'lucide-react'
import { Screen } from '../App'

// The exact nav shape from Figma: dark bar with rounded top corners
// and a raised circular + button in the center

interface Props {
  onNavigate: (screen: Screen) => void
  onAddPress?: () => void
  onCalendarPress?: () => void
  calendarActive?: boolean
}

export default function BottomNav({ onNavigate, onAddPress, onCalendarPress, calendarActive }: Props) {
  return (
    <div className="relative flex-shrink-0" style={{ height: 80 }}>
      {/* SVG curve for the top of the nav */}
      <div className="absolute inset-0 overflow-visible pointer-events-none">
        <svg
          viewBox="0 0 393 80"
          width="393"
          height="80"
          className="absolute bottom-0 left-0"
          style={{ overflow: 'visible' }}
        >
          <path
            d="M0,20 Q0,0 20,0 L156,0 Q170,0 174,14 A46,46 0 0,0 219,14 Q223,0 237,0 L373,0 Q393,0 393,20 L393,80 L0,80 Z"
            fill="#272724"
          />
          {/* Raised platform for center button */}
          <ellipse cx="196.5" cy="2" rx="58" ry="58" fill="#272724" />
        </svg>
      </div>

      {/* Nav background */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: 57,
          background: '#272724',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 30,
        }}
      />

      {/* Left icon: Calendar */}
      <button
        onClick={onCalendarPress || (() => onNavigate('home'))}
        className={`absolute bottom-5 left-10 transition-colors ${calendarActive ? 'text-[#9CADFF]' : 'text-white/80 hover:text-white'}`}
        aria-label="Calendar"
      >
        <Calendar size={24} strokeWidth={1.5} />
      </button>

      {/* Center + button */}
      <button
        onClick={onAddPress || (() => onNavigate('emotion-step1'))}
        className="absolute left-1/2 -translate-x-1/2"
        style={{ bottom: 14 }}
        aria-label="Add entry"
      >
        <div
          className="flex items-center justify-center shadow-lg"
          style={{
            width: 75,
            height: 75,
            borderRadius: '50%',
            background: '#9CADFF',
            border: '3px solid #272724',
          }}
        >
          <Plus size={32} color="#272724" strokeWidth={2.5} />
        </div>
      </button>

      {/* Right icon: Profile */}
      <button
        onClick={() => {}}
        className="absolute bottom-5 right-10 text-white/80 hover:text-white transition-colors"
        aria-label="Profile"
      >
        <User size={26} strokeWidth={1.5} />
      </button>
    </div>
  )
}
