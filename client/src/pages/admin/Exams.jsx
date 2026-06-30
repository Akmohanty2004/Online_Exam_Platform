import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getAdminExams } from '../../redux/slices/adminSlice'

const AdminExams = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { exams } = useSelector(state => state.admin)

  useEffect(() => {
    dispatch(getAdminExams())
  }, [dispatch])

  return (
    <div>
      <div className="welcome-banner">
        <h2>All Exams</h2>
        <p>View and manage all exams on the platform</p>
      </div>

      <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'rgba(30, 41, 59, 0.5)' }}>
              <tr>
                <th style={{ padding: '14px 20px', textAlign: 'left', color: 'var(--dark-400)', fontSize: '12px', textTransform: 'uppercase' }}>Title</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', color: 'var(--dark-400)', fontSize: '12px', textTransform: 'uppercase' }}>Subject</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', color: 'var(--dark-400)', fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', color: 'var(--dark-400)', fontSize: '12px', textTransform: 'uppercase' }}>Submissions</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', color: 'var(--dark-400)', fontSize: '12px', textTransform: 'uppercase' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam, index) => (
                <tr key={exam._id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '14px 20px', color: 'var(--text-main)' }}>
                    <div style={{ fontWeight: '500' }}>{exam.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--dark-400)' }}>{exam.createdBy?.name || 'Unknown'}</div>
                  </td>
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
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                      onClick={() => navigate(`/admin/results?examId=${exam._id}`)}
                    >
                      View Results
                    </button>
                  </td>
                </tr>
              ))}
              {exams.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: 'var(--dark-400)' }}>
                    No exams found
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

export default AdminExams