import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiUsers, FiBook, FiTrendingUp, FiAward, FiClock, FiCheckCircle } from 'react-icons/fi'
import { Line, Pie, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { getAdminDashboardStats } from '../../redux/slices/adminSlice'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const AdminDashboard = () => {
  const dispatch = useDispatch()
  const { stats, isLoading } = useSelector(state => state.admin)
  // We don't need random state anymore!
  // const [realTime, setRealTime] = useState({ online: 0, active: 0 })

  useEffect(() => {
    dispatch(getAdminDashboardStats())
    // Remove interval, fetch maybe on focus or rely on websockets if any.
  }, [dispatch])

  // Chart data
  const userDistributionData = {
    labels: ['Students', 'Teachers', 'Admins'],
    datasets: [
      {
        data: [stats?.totalStudents || 0, stats?.totalTeachers || 0, stats?.totalAdmins || 1],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(99, 102, 241)',
          'rgb(139, 92, 246)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2
      }
    ]
  }

  const examStatusData = {
    labels: ['Active', 'Completed', 'Upcoming'],
    datasets: [
      {
        data: [stats?.activeExams || 0, stats?.completedExams || 0, stats?.totalExams - (stats?.activeExams || 0) - (stats?.completedExams || 0)],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(99, 102, 241, 0.8)',
          'rgba(245, 158, 11, 0.8)'
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(99, 102, 241)',
          'rgb(245, 158, 11)'
        ],
        borderWidth: 2
      }
    ]
  }

  // Process monthly data for charts
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const examsDataArray = new Array(12).fill(0);
  const passedDataArray = new Array(12).fill(0);

  if (stats?.monthlyExams) {
    stats.monthlyExams.forEach(item => {
      if (item._id >= 1 && item._id <= 12) examsDataArray[item._id - 1] = item.count;
    });
  }

  if (stats?.monthlyResults) {
    stats.monthlyResults.forEach(item => {
      if (item._id >= 1 && item._id <= 12) passedDataArray[item._id - 1] = item.passed;
    });
  }

  const performanceData = {
    labels: monthNames,
    datasets: [
      {
        label: 'Exams Conducted',
        data: examsDataArray,
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(99, 102, 241)',
      },
      {
        label: 'Students Passed',
        data: passedDataArray,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(16, 185, 129)',
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#94a3b8' }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(148, 163, 184, 0.1)' }
      },
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(148, 163, 184, 0.1)' }
      }
    }
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#94a3b8' }
      }
    }
  }

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: FiUsers, color: 'blue' },
    { label: 'Total Exams', value: stats?.totalExams || 0, icon: FiBook, color: 'purple' },
    { label: 'Active Exams', value: stats?.activeExams || 0, icon: FiClock, color: 'green' },
    { label: 'Results Published', value: stats?.totalResults || 0, icon: FiAward, color: 'orange' },
    { label: 'Passed', value: stats?.totalPassed || 0, icon: FiCheckCircle, color: 'green' },
    { label: 'Failed', value: stats?.totalFailed || 0, icon: FiTrendingUp, color: 'red' },
  ]

  return (
    <div>
      <div className="welcome-banner">
        <h2>Admin Dashboard 👑</h2>
        <p>System overview and real-time analytics</p>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div className="stat-card" key={index}>
              <div className={`stat-icon ${stat.color}`}>
                <Icon />
              </div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
            </div>
          )
        })}
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>User Distribution</h3>
          <div className="chart-wrapper">
            <Pie data={userDistributionData} options={pieOptions} />
          </div>
        </div>
        <div className="chart-container">
          <h3>Exam Status</h3>
          <div className="chart-wrapper">
            <Pie data={examStatusData} options={pieOptions} />
          </div>
        </div>
      </div>

      <div className="chart-container" style={{ marginBottom: '20px' }}>
        <h3>Annual Performance Trend</h3>
        <div className="chart-wrapper" style={{ height: '280px' }}>
          <Line data={performanceData} options={chartOptions} />
        </div>
      </div>

      <div className="chart-container">
        <h3>System Health</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '20px 0' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--dark-400)', fontSize: '14px' }}>
              <span>Server Status</span>
              <span style={{ color: 'var(--success)' }}>🟢 Online</span>
            </div>
            <div style={{ marginTop: '8px', height: '4px', background: 'var(--dark-700)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', background: 'var(--success)' }} />
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--dark-400)', fontSize: '14px' }}>
              <span>Database</span>
              <span style={{ color: 'var(--success)' }}>🟢 Connected</span>
            </div>
            <div style={{ marginTop: '8px', height: '4px', background: 'var(--dark-700)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', background: 'var(--success)' }} />
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--dark-400)', fontSize: '14px' }}>
              <span>Online Users</span>
              <span style={{ color: 'var(--info)' }}>{stats?.activeUsers || 0}</span>
            </div>
            <div style={{ marginTop: '8px', height: '4px', background: 'var(--dark-700)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(100, (stats?.activeUsers || 0) * 2)}%`, height: '100%', background: 'var(--info)' }} />
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--dark-400)', fontSize: '14px' }}>
              <span>Memory Usage</span>
              <span style={{ color: 'var(--warning)' }}>{stats?.memoryUsage || 0}%</span>
            </div>
            <div style={{ marginTop: '8px', height: '4px', background: 'var(--dark-700)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: `${stats?.memoryUsage || 0}%`, height: '100%', background: 'var(--warning)' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard