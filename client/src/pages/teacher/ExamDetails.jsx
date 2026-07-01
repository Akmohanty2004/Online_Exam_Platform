import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getExamById, publishExamResults } from '../../redux/slices/examSlice'
import { getTeacherResults } from '../../redux/slices/resultSlice'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const ExamDetails = () => {
  const { examId } = useParams()
  const dispatch = useDispatch()
  const { currentExam } = useSelector(state => state.exams)
  const { results: rawResults, stats } = useSelector(state => state.results)
  const results = Array.isArray(rawResults) ? rawResults : []

  useEffect(() => {
    if (examId) {
      dispatch(getExamById(examId))
      dispatch(getTeacherResults(examId))
    }
  }, [dispatch, examId])

  const handlePublishResults = () => {
    if (window.confirm('Are you sure you want to publish the results? Students will be able to see their marks.')) {
      dispatch(publishExamResults(examId))
    }
  }

  if (!currentExam) {
    return <div style={{ color: 'var(--dark-400)', padding: '40px', textAlign: 'center' }}>Loading...</div>
  }

  const exam = currentExam

  // Calculate if exam has ended
  const now = new Date();
  const examDate = new Date(exam.date);
  const [endHours, endMinutes] = (exam.endTime || '23:59').split(':');
  examDate.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);
  const isExamEnded = now >= examDate;

  return (
    <div>
      <div className="welcome-banner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>{exam.title}</h2>
          <p>{exam.subject} • {exam.status}</p>
        </div>
        {exam.status !== 'draft' && !exam.isResultPublished && (
          <div style={{ position: 'relative' }} title={!isExamEnded ? "You cannot publish results before the exam ends." : ""}>
            <button 
              className={`btn-primary ${!isExamEnded ? 'disabled' : ''}`} 
              onClick={handlePublishResults}
              disabled={!isExamEnded}
              style={{ opacity: !isExamEnded ? 0.5 : 1, cursor: !isExamEnded ? 'not-allowed' : 'pointer' }}
            >
              Publish Results
            </button>
          </div>
        )}
        {exam.isResultPublished && (
          <span className="badge badge-success">Results Published</span>
        )}
      </div>

      <div className="stats-grid" style={{ marginBottom: '20px' }}>
        <div className="stat-card">
          <div className="stat-label">Total Questions</div>
          <div className="stat-value">{exam.totalQuestions || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Duration</div>
          <div className="stat-value">{exam.duration} min</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Students</div>
          <div className="stat-value">{exam.totalSubmitted || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Passing Marks</div>
          <div className="stat-value">{exam.passingMarks || 0}</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ color: 'var(--text-main)', marginBottom: '12px' }}>Exam Details</h3>
        <div style={{ color: 'var(--dark-300)', lineHeight: '1.8' }}>
          <p><strong style={{ color: 'var(--dark-400)' }}>Date:</strong> {new Date(exam.date).toLocaleDateString()}</p>
          <p><strong style={{ color: 'var(--dark-400)' }}>Time:</strong> {exam.startTime} - {exam.endTime}</p>
          <p><strong style={{ color: 'var(--dark-400)' }}>Description:</strong> {exam.description || 'N/A'}</p>
          <p><strong style={{ color: 'var(--dark-400)' }}>Instructions:</strong> {exam.instructions || 'N/A'}</p>
        </div>
      </div>

      {results && results.length > 0 && (
        <div className="stats-grid" style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
          <div className="card" style={{ padding: '15px', textAlign: 'center' }}>
            <div style={{ color: 'var(--dark-400)', fontSize: '12px', textTransform: 'uppercase' }}>Total Students</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary-500)', marginTop: '4px' }}>{results.length}</div>
          </div>
          <div className="card" style={{ padding: '15px', textAlign: 'center' }}>
            <div style={{ color: 'var(--dark-400)', fontSize: '12px', textTransform: 'uppercase' }}>Total Passed</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981', marginTop: '4px' }}>{results.filter(r => r.isPassed).length}</div>
          </div>
          <div className="card" style={{ padding: '15px', textAlign: 'center' }}>
            <div style={{ color: 'var(--dark-400)', fontSize: '12px', textTransform: 'uppercase' }}>Total Failed</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444', marginTop: '4px' }}>{results.filter(r => !r.isPassed).length}</div>
          </div>
          <div className="card" style={{ padding: '15px', textAlign: 'center' }}>
            <div style={{ color: 'var(--dark-400)', fontSize: '12px', textTransform: 'uppercase' }}>Cheating Detected</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b', marginTop: '4px' }}>{results.filter(r => r.tabSwitches > 0).length}</div>
          </div>
        </div>
      )}

      {results && results.length > 0 && (
        <div className="charts-grid" style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="card">
            <h3 style={{ color: 'var(--text-main)', marginBottom: '16px' }}>Pass/Fail Distribution</h3>
            <div style={{ height: '300px' }}>
              <Pie
                data={{
                  labels: ['Passed', 'Failed'],
                  datasets: [{
                    data: [stats?.passed || 0, stats?.failed || 0],
                    backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(239, 68, 68, 0.8)'],
                    borderColor: ['rgb(16, 185, 129)', 'rgb(239, 68, 68)'],
                    borderWidth: 2
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { labels: { color: 'var(--dark-400)' } }
                  }
                }}
              />
            </div>
          </div>
          <div className="card">
            <h3 style={{ color: 'var(--text-main)', marginBottom: '16px' }}>Anti-Cheat: Tab Switching Tracker</h3>
            <div style={{ height: '300px' }}>
              <Bar
                data={{
                  labels: results.map(r => r.studentId?.name || 'Unknown'),
                  datasets: [{
                    label: 'Number of Tab Switches',
                    data: results.map(r => r.tabSwitches || 0),
                    backgroundColor: 'rgba(239, 68, 68, 0.6)',
                    borderColor: 'rgba(239, 68, 68, 1)',
                    borderWidth: 1
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { color: 'var(--dark-400)', stepSize: 1 },
                      grid: { color: 'rgba(255,255,255,0.05)' }
                    },
                    x: {
                      ticks: { color: 'var(--dark-400)' },
                      grid: { display: false }
                    }
                  },
                  plugins: {
                    legend: {
                      labels: { color: 'var(--dark-400)' }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Cheating List Section */}
      {results && results.some(r => r.tabSwitches > 0) && (
        <div className="card" style={{ marginTop: '20px' }}>
          <h3 style={{ color: '#ef4444', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ⚠️ Students Flagged for Cheating
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#ef4444', fontSize: '12px', textTransform: 'uppercase' }}>Student Name</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#ef4444', fontSize: '12px', textTransform: 'uppercase' }}>Type of Cheating</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#ef4444', fontSize: '12px', textTransform: 'uppercase' }}>Tab Switches</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#ef4444', fontSize: '12px', textTransform: 'uppercase' }}>Action Taken</th>
                </tr>
              </thead>
              <tbody>
                {results.filter(r => r.tabSwitches > 0).map(result => (
                  <tr key={result._id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '12px', color: 'var(--text-main)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>{result.studentId?.name || 'Unknown'}</span>
                        <span style={{ fontSize: '12px', color: 'var(--dark-400)' }}>{result.studentId?.email}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: '#f59e0b', fontSize: '13px' }}>Switched Tabs / Left Window</td>
                    <td style={{ padding: '12px', color: '#ef4444', fontWeight: 'bold' }}>{result.tabSwitches} times</td>
                    <td style={{ padding: '12px', color: 'var(--dark-400)' }}>Flagged in system</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Passing and Failing Students Section */}
      {results && results.length > 0 && (
        <div className="charts-grid" style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="card">
            <h3 style={{ color: '#10b981', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ✅ Passing Students
            </h3>
            {results.filter(r => r.isPassed).length > 0 ? (
              <div style={{ overflowX: 'auto', maxHeight: '300px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                    <tr>
                      <th style={{ padding: '10px', textAlign: 'left', color: '#10b981', fontSize: '12px', textTransform: 'uppercase' }}>Name</th>
                      <th style={{ padding: '10px', textAlign: 'left', color: '#10b981', fontSize: '12px', textTransform: 'uppercase' }}>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.filter(r => r.isPassed).map(result => (
                      <tr key={result._id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '10px', color: 'var(--text-main)' }}>{result.studentId?.name || 'Unknown'}</td>
                        <td style={{ padding: '10px', color: 'var(--text-main)' }}>{result.percentage?.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: 'var(--dark-400)' }}>No students passed.</p>
            )}
          </div>

          <div className="card">
            <h3 style={{ color: '#ef4444', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ❌ Failing Students
            </h3>
            {results.filter(r => !r.isPassed).length > 0 ? (
              <div style={{ overflowX: 'auto', maxHeight: '300px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                    <tr>
                      <th style={{ padding: '10px', textAlign: 'left', color: '#ef4444', fontSize: '12px', textTransform: 'uppercase' }}>Name</th>
                      <th style={{ padding: '10px', textAlign: 'left', color: '#ef4444', fontSize: '12px', textTransform: 'uppercase' }}>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.filter(r => !r.isPassed).map(result => (
                      <tr key={result._id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '10px', color: 'var(--text-main)' }}>{result.studentId?.name || 'Unknown'}</td>
                        <td style={{ padding: '10px', color: 'var(--text-main)' }}>{result.percentage?.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: 'var(--dark-400)' }}>No students failed.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ExamDetails