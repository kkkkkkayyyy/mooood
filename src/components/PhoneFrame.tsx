import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function PhoneFrame({ children }: Props) {
  return (
    <div className="relative flex flex-col w-full h-dvh overflow-hidden bg-[#FFFEFA] lg:w-[393px] lg:h-[852px] lg:rounded-[50px] lg:shadow-phone lg:flex-shrink-0">
      {/* Dynamic Island — only visible in desktop mockup */}
      <div
        className="hidden lg:block absolute top-3 left-1/2 -translate-x-1/2 z-50 rounded-[20px] bg-black"
        style={{ width: 126, height: 37 }}
      />

      {/* Screen content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>

      {/* Home indicator — only visible in desktop mockup */}
      <div className="hidden lg:block absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full bg-black/20" />
    </div>
  )
}
