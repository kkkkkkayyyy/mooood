import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function PhoneFrame({ children }: Props) {
  return (
    <div
      className="relative flex flex-col"
      style={{
        width: 393,
        height: 852,
        borderRadius: 50,
        overflow: 'hidden',
        boxShadow:
          '0 0 0 2px #1a1a1a, 0 0 0 6px #2c2c2c, 0 30px 80px rgba(0,0,0,0.5)',
        background: '#FFFEFA',
        flexShrink: 0,
      }}
    >
      {/* Dynamic Island */}
      <div
        className="absolute top-3 left-1/2 -translate-x-1/2 z-50"
        style={{
          width: 126,
          height: 37,
          borderRadius: 20,
          background: '#000',
        }}
      />

      {/* Screen content */}
      <div
        className="flex-1 flex flex-col overflow-hidden"
        style={{ paddingTop: 0 }}
      >
        {children}
      </div>

      {/* Home indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full bg-black/20" />
    </div>
  )
}
