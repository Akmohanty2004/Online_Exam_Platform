import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiBook, FiUsers, FiTrendingUp, FiAward, FiClock, FiCheckCircle } from 'react-icons/fi'
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
import { getTeacherExams } from '../../redux/slices/examSlice'
import { getTeacherResults } from '../../redux/slices/resultSlice'

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

const TeacherDashboard = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { exams } = useSelector(state => state.exams)
  const { results, stats } = useSelector(state => state.results)

  useEffect(() => {
    dispatch(getTeacherExams())
  }, [dispatch])

  // Calculate real stats from actual data
  const totalExams = exams?.length || 0
  const drafts = exams?.filter(e => e.status === 'draft').length || 0
  const published = exams?.filter(e => e.status === 'published').length || 0
  const ongoing = exams?.filter(e => e.status === 'ongoing').length || 0
  const completed = exams?.filter(e => e.status === 'completed').length || 0
  
  // Aggregate stats from all exams
  const totalStudents = exams?.reduce((sum, exam) => sum + (exam.totalSubmitted || 0), 0) || 0
  const passed = exams?.reduce((sum, exam) => sum + (exam.totalPassed || 0), 0) || 0
  const failed = exams?.reduce((sum, exam) => sum + (exam.totalFailed || 0), 0) || 0
  
  // Calculate average score across all exams (weighted by submissions or simple average)
  const examsWithScores = exams?.filter(e => e.totalSubmitted > 0) || []
  const avgScore = examsWithScores.length > 0 
    ? examsWithScores.reduce((sum, exam) => sum + ((exam.averageScore || 0) / (exam.maxMarks || 100) * 100), 0) / examsWithScores.length 
    : 0

  const statCards = [
    { label: 'Total Exams', value: totalExams, icon: FiBook, color: 'blue' },
    { label: 'Published', value: published, icon: FiCheckCircle, color: 'green' },
    { label: 'Ongoing', value: ongoing, icon: FiClock, color: 'orange' },
    { label: 'Completed', value: completed, icon: FiAward, color: 'purple' },
    { label: 'Avg Score', value: `${avgScore.toFixed(1)}%`, icon: FiTrendingUp, color: 'yellow' },
  ]

  // Chart data
  const examStatusData = {
    labels: ['Published', 'Ongoing', 'Completed'],
    datasets: [
      {
        data: [published, ongoing, completed],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(16, 185, 129, 0.8)'
        ],
        borderColor: [
          'rgb(99, 102, 241)',
          'rgb(245, 158, 11)',
          'rgb(16, 185, 129)'
        ],
        borderWidth: 2
      }
    ]
  }

  const resultStatsData = {
    labels: ['Passed', 'Failed'],
    datasets: [
      {
        data: [passed, failed],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2
      }
    ]
  }

  // Dynamic Weekly Performance Trend (based on last 7 exams)
  const recentExamsForChart = exams && exams.length > 0 
    ? [...exams].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-7)
    : []

  const weeklyPerformanceData = {
    labels: recentExamsForChart.length > 0 ? recentExamsForChart.map(e => e.title.substring(0, 10)) : ['No Data'],
    datasets: [
      {
        label: 'Avg Score %',
        data: recentExamsForChart.length > 0 ? recentExamsForChart.map(e => (e.averageScore || 0) / (e.maxMarks || 100) * 100) : [0],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(99, 102, 241)',
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

  return (
    <div>
      <div className="welcome-banner">
        <div>
          <h2>Welcome back, {user?.name}! ✨</h2>
          <p>Here's your teaching statistics and exam performance at a glance</p>
        </div>
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
          <h3>Exam Status Distribution</h3>
          <div className="chart-wrapper">
            <Pie data={examStatusData} options={pieOptions} />
          </div>
        </div>
        <div className="chart-container">
          <h3>Pass/Fail Distribution</h3>
          <div className="chart-wrapper">
            <Pie data={resultStatsData} options={pieOptions} />
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>Weekly Performance Trend</h3>
          <div className="chart-wrapper">
            <Line data={weeklyPerformanceData} options={chartOptions} />
          </div>
        </div>
        <div className="chart-container">
          <h3>Recent Exams</h3>
          <div className="recent-list">
            {exams?.slice(0, 5).map((exam) => (
              <div className="recent-item" key={exam._id}>
                <div className="item-info">
                  <span className="title">{exam.title}</span>
                  <span className="subtitle">{exam.subject} • {new Date(exam.date).toLocaleDateString()}</span>
                </div>
                <div className="item-status">
                  <span className={`badge ${
                    exam.status === 'published' ? 'badge-info' :
                    exam.status === 'ongoing' ? 'badge-warning' :
                    exam.status === 'completed' ? 'badge-success' :
                    'badge-secondary'
                  }`}>
                    {exam.status}
                  </span>
                </div>
              </div>
            ))}
            {(!exams || exams.length === 0) && (
              <p style={{ color: 'var(--dark-400)', textAlign: 'center', padding: '20px' }}>
                No exams created yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherDashboard