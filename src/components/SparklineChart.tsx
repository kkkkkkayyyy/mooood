import { AreaChart, Area, ResponsiveContainer } from 'recharts'

const data = [
  { v: 65 }, { v: 72 }, { v: 68 }, { v: 85 }, { v: 78 },
  { v: 72 }, { v: 88 }, { v: 75 }, { v: 82 }, { v: 72 },
]

interface Props {
  color?: string
  height?: number
}

export default function SparklineChart({ color = '#9CADFF', height = 32 }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.4} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          fill="url(#sparkGrad)"
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
