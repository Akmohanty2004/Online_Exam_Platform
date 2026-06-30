import React from 'react'
import { Pie, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
)

const PieChart = ({ data, options, height = 300, title, type = 'pie' }) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#94a3b8' }
      }
    }
  }

  const chartData = data || {
    labels: ['Passed', 'Failed', 'Pending'],
    datasets: [
      {
        data: [65, 20, 15],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)'
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(239, 68, 68)',
          'rgb(245, 158, 11)'
        ],
        borderWidth: 2
      }
    ]
  }

  const ChartComponent = type === 'doughnut' ? Doughnut : Pie

  return (
    <div style={{ height: height }}>
      {title && <h3 style={{ color: 'white', marginBottom: '16px' }}>{title}</h3>}
      <ChartComponent data={chartData} options={options || defaultOptions} />
    </div>
  )
}

export default PieChart