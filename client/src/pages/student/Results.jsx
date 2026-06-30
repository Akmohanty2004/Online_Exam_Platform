import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { 
  FiCalendar, FiClock, FiCheckCircle, FiXCircle,
  FiTrendingUp, FiAward
} from 'react-icons/fi'
import { getStudentResults } from '../../redux/slices/resultSlice'

const StudentResults = () => {
  const dispatch = useDispatch()
  const { results } = useSelector(state => state.results)

  useEffect(() => {
    dispatch(getStudentResults())
  }, [dispatch])

  const publishedResults = results?.filter(r => r.isPublished) || []

  const stats = {
    total: results?.length || 0, // Still show total exams taken
    passed: publishedResults.filter(r => r.isPassed).length || 0,
    failed: publishedResults.filter(r => !r.isPassed).length || 0,
    average: publishedResults.length > 0 
      ? (publishedResults.reduce((a, b) => a + (b.percentage || 0), 0) / publishedResults.length).toFixed(1)
      : 0
  }

  return (
    <div>
      <div className="welcome-banner">
        <h2>My Results</h2>
        <p>View all your exam results and performance</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Exams</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card" style={{ background: 'rgba(16,185,129,0.05)' }}>
          <div className="stat-label">Passed</div>
          <div className="stat-value" style={{ color: 'var(--success)' }}>{stats.passed}</div>
        </div>
        <div className="stat-card" style={{ background: 'rgba(239,68,68,0.05)' }}>
          <div className="stat-label">Failed</div>
          <div className="stat-value" style={{ color: 'var(--danger)' }}>{stats.failed}</div>
        </div>
        <div className="stat-card" style={{ background: 'rgba(99,102,241,0.05)' }}>
          <div className="stat-label">Average Score</div>
          <div className="stat-value" style={{ color: 'var(--primary-400)' }}>{stats.average}%</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ color: 'white', fontWeight: 600, fontSize: '18px' }}>Detailed Results</h3>
        {results?.map((result, index) => (
          <motion.div
            key={result._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <h4 style={{ color: 'white', fontWeight: 600 }}>{result.examId?.title || 'Unknown Exam'}</h4>
                  <span className={`badge ${result.isPassed ? 'badge-success' : 'badge-danger'}`}>
                    {result.isPassed ? 'Passed' : 'Failed'}
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '6px', color: 'var(--dark-400)', fontSize: '14px' }}>
                  <span>{result.examId?.subject || 'N/A'}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiCalendar style={{ color: 'var(--primary-400)' }} />
                    {new Date(result.submittedAt).toLocaleDateString()}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiClock style={{ color: 'var(--primary-400)' }} />
                    {result.timeTaken || 0} min
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {result.isPublished ? (
                  <>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: 700, color: 'white' }}>{result.percentage?.toFixed(1)}%</div>
                      <div style={{ fontSize: '12px', color: 'var(--dark-400)' }}>Score</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: 700, color: 'white' }}>{result.grade || 'N/A'}</div>
                      <div style={{ fontSize: '12px', color: 'var(--dark-400)' }}>Grade</div>
                    </div>
                    {result.rank && (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--primary-400)' }}>#{result.rank}</div>
                        <div style={{ fontSize: '12px', color: 'var(--dark-400)' }}>Rank</div>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ padding: '8px 16px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '50px', color: 'var(--warning)', fontSize: '14px', fontWeight: 500 }}>
                    Result Pending
                  </div>
                )}
              </div>
            </div>
            {result.isPublished && (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '14px' }}>
                  <div>
                    <div style={{ color: 'var(--dark-400)' }}>Correct</div>
                    <div style={{ color: 'var(--success)', fontWeight: 500 }}>{result.correctAnswers || 0}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--dark-400)' }}>Wrong</div>
                    <div style={{ color: 'var(--danger)', fontWeight: 500 }}>{result.wrongAnswers || 0}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--dark-400)' }}>Unattempted</div>
                    <div style={{ color: 'var(--warning)', fontWeight: 500 }}>{result.unattempted || 0}</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
        {(!results || results.length === 0) && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--dark-400)' }}>
            No results found
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentResults