import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiBook, FiCheckCircle, FiClock, FiTrendingUp, FiAward } from 'react-icons/fi'
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
import { getStudentExams } from '../../redux/slices/examSlice'
import { getStudentResults } from '../../redux/slices/resultSlice'

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

const StudentDashboard = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { exams } = useSelector(state => state.exams)
  const { results } = useSelector(state => state.results)
  const [stats, setStats] = useState({
    totalExams: 0,
    completed: 0,
    pending: 0,
    averageScore: 0,
    highestScore: 0,
    passRate: 0,
    rank: 0
  })

  useEffect(() => {
    dispatch(getStudentExams())
    dispatch(getStudentResults())
  }, [dispatch])

  useEffect(() => {
    if (exams && results) {
      // Filter results to only include those where the exam's results are published
      const publishedResults = results?.filter(r => r.isPublished) || []
      
      const completed = results?.filter(r => r.status === 'submitted' || r.isCompleted).length || 0
      const totalExams = exams?.length || 0
      const pending = totalExams - completed
      
      const scores = publishedResults.map(r => r.percentage || 0)
      const averageScore = scores.length > 0 
        ? scores.reduce((a, b) => a + b, 0) / scores.length 
        : 0
      const highestScore = scores.length > 0 ? Math.max(...scores) : 0
      const passed = publishedResults.filter(r => r.isPassed).length
      const passRate = publishedResults.length > 0 ? (passed / publishedResults.length) * 100 : 0
      
      // Calculate overall rank (average of their ranks in published exams)
      const ranks = publishedResults.map(r => r.rank).filter(r => r != null && r > 0)
      const rank = ranks.length > 0 ? Math.round(ranks.reduce((a, b) => a + b, 0) / ranks.length) : '-'

      setStats({
        totalExams,
        completed,
        pending,
        averageScore,
        highestScore,
        passRate,
        passed,
        rank
      })
    }
  }, [exams, results])

  // Performance Trend Chart (Only Published)
  const publishedResults = results?.filter(r => r.isPublished) || []
  
  const performanceData = {
    labels: publishedResults.map(r => r.examId?.title || 'Exam') || ['No Data'],
    datasets: [
      {
        label: 'Score %',
        data: publishedResults.map(r => r.percentage || 0) || [0],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(99, 102, 241)',
      }
    ]
  }

  // Calculate subject-wise performance dynamically (Only Published)
  const subjectPerformance = publishedResults.reduce((acc, result) => {
    const subject = result.examId?.subject;
    if (subject) {
      if (!acc[subject]) acc[subject] = { totalPercentage: 0, count: 0 };
      acc[subject].totalPercentage += (result.percentage || 0);
      acc[subject].count += 1;
    }
    return acc;
  }, {}) || {};

  const subjectLabels = Object.keys(subjectPerformance);
  const subjectAverages = subjectLabels.map(
    sub => subjectPerformance[sub].totalPercentage / subjectPerformance[sub].count
  );

  const subjectData = {
    labels: subjectLabels.length > 0 ? subjectLabels : ['No Data'],
    datasets: [
      {
        label: 'Average Score',
        data: subjectAverages.length > 0 ? subjectAverages : [0],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(99, 102, 241)',
          'rgb(139, 92, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2
      }
    ]
  }

  // Pass/Fail Distribution
  const pieData = {
    labels: ['Passed', 'Failed'],
    datasets: [
      {
        data: [stats.passRate, 100 - stats.passRate],
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
        max: 100,
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
    { label: 'Exams Taken', value: stats.completed, icon: FiBook, color: 'blue' },
    { label: 'Passed', value: stats.passed, icon: FiCheckCircle, color: 'green' },
    { label: 'Avg Score', value: `${stats.averageScore.toFixed(1)}%`, icon: FiTrendingUp, color: 'purple' },
    { label: 'Rank', value: stats.rank === '-' ? '-' : `#${stats.rank}`, icon: FiAward, color: 'yellow' },
  ]

  return (
    <div>
      <div className="welcome-banner">
        <h2>Welcome back, {user?.name || 'Student'}! 👋</h2>
        <p>Here's your exam performance summary</p>
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
          <h3>Performance Trend</h3>
          <div className="chart-wrapper">
            <Line data={performanceData} options={chartOptions} />
          </div>
        </div>
        <div className="chart-container">
          <h3>Subject Performance</h3>
          <div className="chart-wrapper">
            <Bar data={subjectData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>Pass/Fail Distribution</h3>
          <div className="chart-wrapper">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
        <div className="chart-container">
          <h3>Recent Exams</h3>
          <div className="recent-list">
            {[...exams || []].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5).map((exam) => (
              <div className="recent-item" key={exam._id}>
                <div className="item-info">
                  <span className="title">{exam.title}</span>
                  <span className="subtitle">{exam.subject} • {new Date(exam.date).toLocaleDateString()} • {exam.startTime} - {exam.endTime}</span>
                </div>
                <div className="item-status">
                  <span className={`badge ${exam.isTaken ? 'badge-success' : exam.isAvailable ? 'badge-warning' : exam.isUpcoming ? 'badge-info' : 'badge-danger'}`}>
                    {exam.isTaken ? 'Completed' : exam.isAvailable ? 'Available' : exam.isUpcoming ? 'Upcoming' : 'Expired'}
                  </span>
                </div>
              </div>
            ))}
            {(!exams || exams.length === 0) && (
              <p style={{ color: 'var(--dark-400)', textAlign: 'center', padding: '20px' }}>
                No exams available. Check back later!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard