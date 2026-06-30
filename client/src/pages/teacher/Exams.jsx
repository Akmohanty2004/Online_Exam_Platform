import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FiPlus, FiEye } from 'react-icons/fi'
import { getTeacherExams } from '../../redux/slices/examSlice'

const TeacherExams = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { exams } = useSelector(state => state.exams)

  useEffect(() => {
    dispatch(getTeacherExams())
  }, [dispatch])

  return (
    <div>
      <div className="welcome-banner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>My Exams</h2>
          <p>Manage all your examinations</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/teacher/create-exam')}>
          <FiPlus /> Create New Exam
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total</div>
          <div className="stat-value">{exams.length}</div>
        </div>
        <div className="stat-card" style={{ background: 'rgba(59, 130, 246, 0.05)' }}>
          <div className="stat-label">Published</div>
          <div className="stat-value" style={{ color: 'var(--info)' }}>
            {exams.filter(e => e.status === 'published').length}
          </div>
        </div>
        <div className="stat-card" style={{ background: 'rgba(245, 158, 11, 0.05)' }}>
          <div className="stat-label">Ongoing</div>
          <div className="stat-value" style={{ color: 'var(--warning)' }}>
            {exams.filter(e => e.status === 'ongoing').length}
          </div>
        </div>
        <div className="stat-card" style={{ background: 'rgba(16, 185, 129, 0.05)' }}>
          <div className="stat-label">Completed</div>
          <div className="stat-value" style={{ color: 'var(--success)' }}>
            {exams.filter(e => e.status === 'completed').length}
          </div>
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'rgba(30, 41, 59, 0.5)' }}>
              <tr>
                <th style={{ padding: '14px 20px', textAlign: 'left', color: 'var(--dark-400)', fontSize: '12px', textTransform: 'uppercase' }}>Title</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', color: 'var(--dark-400)', fontSize: '12px', textTransform: 'uppercase' }}>Subject</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', color: 'var(--dark-400)', fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', color: 'var(--dark-400)', fontSize: '12px', textTransform: 'uppercase' }}>Students</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', color: 'var(--dark-400)', fontSize: '12px', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam, index) => (
                <tr key={exam._id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '14px 20px', color: 'var(--text-main)' }}>{exam.title}</td>
                  <td style={{ padding: '14px 20px', color: 'var(--dark-300)' }}>{exam.subject}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span className={`badge ${
                      exam.status === 'published' ? 'badge-info' :
                      exam.status === 'ongoing' ? 'badge-warning' :
                      exam.status === 'completed' ? 'badge-success' :
                      'badge-secondary'
                    }`}>
                      {exam.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', color: 'var(--dark-300)' }}>{exam.totalSubmitted || 0}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <button 
                      className="btn-secondary" 
                      style={{ padding: '6px 12px', fontSize: '13px' }}
                      onClick={() => navigate(`/teacher/exam/${exam._id}`)}
                    >
                      <FiEye /> View
                    </button>
                  </td>
                </tr>
              ))}
              {exams.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--dark-400)' }}>
                    No exams found. Create your first exam!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default TeacherExams