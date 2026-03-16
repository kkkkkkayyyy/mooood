interface Props {
  total: number
  current: number // 1-based
}

export default function ProgressBar({ total, current }: Props) {
  const progress = current / total

  return (
    <div className="relative w-full h-1 rounded-full overflow-hidden" style={{ background: '#4782D5' }}>
      <div
        className="absolute left-0 top-0 h-full rounded-full transition-all duration-500 ease-out"
        style={{
          width: `${progress * 100}%`,
          background: '#9CADFF',
        }}
      />
    </div>
  )
}
