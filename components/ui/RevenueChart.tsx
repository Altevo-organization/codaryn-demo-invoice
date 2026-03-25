'use client'

interface DataPoint {
  month: string
  amount: number
}

interface RevenueChartProps {
  data: DataPoint[]
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const width = 600
  const height = 200
  const paddingLeft = 60
  const paddingRight = 20
  const paddingTop = 20
  const paddingBottom = 40

  const chartWidth = width - paddingLeft - paddingRight
  const chartHeight = height - paddingTop - paddingBottom

  const maxAmount = Math.max(...data.map((d) => d.amount))
  const yMax = Math.ceil(maxAmount / 2000) * 2000

  const barWidth = (chartWidth / data.length) * 0.5
  const barSpacing = chartWidth / data.length

  const yTicks = [0, yMax * 0.25, yMax * 0.5, yMax * 0.75, yMax]

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ minWidth: '320px' }}
      >
        {/* Y grid lines and labels */}
        {yTicks.map((tick, i) => {
          const y = paddingTop + chartHeight - (tick / yMax) * chartHeight
          return (
            <g key={i}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="#ffffff"
                strokeOpacity={0.04}
                strokeWidth={1}
              />
              <text
                x={paddingLeft - 8}
                y={y + 4}
                textAnchor="end"
                fontSize={10}
                fill="#555E6B"
              >
                {tick >= 1000 ? `${tick / 1000}k` : tick}
              </text>
            </g>
          )
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const barHeight = (d.amount / yMax) * chartHeight
          const x = paddingLeft + i * barSpacing + (barSpacing - barWidth) / 2
          const y = paddingTop + chartHeight - barHeight

          return (
            <g key={d.month}>
              {/* Bar background */}
              <rect
                x={x}
                y={paddingTop}
                width={barWidth}
                height={chartHeight}
                rx={4}
                fill="#ffffff"
                fillOpacity={0.02}
              />
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={4}
                fill="#4F7CFF"
                fillOpacity={0.85}
              />
              {/* X label */}
              <text
                x={x + barWidth / 2}
                y={paddingTop + chartHeight + 20}
                textAnchor="middle"
                fontSize={11}
                fill="#8B93A0"
              >
                {d.month}
              </text>
              {/* Value on top */}
              <text
                x={x + barWidth / 2}
                y={y - 6}
                textAnchor="middle"
                fontSize={10}
                fill="#8B93A0"
              >
                {d.amount >= 1000 ? `${(d.amount / 1000).toFixed(1)}k` : d.amount}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
