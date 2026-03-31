import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function PhoneFrame({ children }: Props) {
  return (
    <div className="relative flex flex-col w-full h-dvh overflow-hidden bg-[#FFFEFA] md:w-[393px] md:h-[852px] md:rounded-[50px] md:shadow-phone md:flex-shrink-0">
      {/* Dynamic Island — only visible in desktop mockup */}
      <div
        className="hidden md:block absolute top-3 left-1/2 -translate-x-1/2 z-50 rounded-[20px] bg-black"
        style={{ width: 126, height: 37 }}
      />

      {/* Screen content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>

      {/* Home indicator — only visible in desktop mockup */}
      <div className="hidden md:block absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full bg-black/20" />
    </div>
  )
}
