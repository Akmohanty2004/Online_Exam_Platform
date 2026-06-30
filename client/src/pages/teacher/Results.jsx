import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiSearch, FiDownload, FiCheckCircle, FiXCircle } from 'react-icons/fi'
import { getTeacherExams } from '../../redux/slices/examSlice'
import { getTeacherResults } from '../../redux/slices/resultSlice'

const TeacherResults = () => {
  const dispatch = useDispatch()
  const { exams } = useSelector(state => state.exams)
  const { results, isLoading } = useSelector(state => state.results)
  const [selectedExam, setSelectedExam] = useState('')

  useEffect(() => {
    dispatch(getTeacherExams())
  }, [dispatch])

  useEffect(() => {
    if (selectedExam) {
      dispatch(getTeacherResults(selectedExam))
    }
  }, [dispatch, selectedExam])

  const selectedExamDetails = exams?.find(e => e._id === selectedExam)

  return (
    <div>
      <div className="welcome-banner">
        <h2>Exam Results</h2>
        <p>View and manage results for your exams</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div className="input-group" style={{ maxWidth: '400px' }}>
          <FiSearch className="icon" />
          <select 
            className="input-field" 
            style={{ paddingLeft: '48px', appearance: 'auto' }}
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
          >
            <option value="">Select an exam</option>
            {exams?.map(exam => (
              <option key={exam._id} value={exam._id}>{exam.title}</option>
            ))}
          </select>
        </div>
      </div>

      {!selectedExam ? (
        <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
          <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ color: 'var(--text-main)', margin: 0 }}>All Exams Overview</h3>
            <p style={{ color: 'var(--dark-400)', fontSize: '13px', margin: '4px 0 0 0' }}>Select an exam from the dropdown to view individual student results</p>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: 'rgba(30, 41, 59, 0.5)' }}>
                <tr>
                  <th style={{ padding: '14px 20px', textAlign: 'left', color: 'var(--dark-400)', fontSize: '12px', textTransform: 'uppercase' }}>Exam Info</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', color: 'var(--dark-400)', fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '14px 20px', textAlign: 'center', color: 'var(--dark-400)', fontSize: '12px', textTransform: 'uppercase' }}>Submissions</th>
                  <th style={{ padding: '14px 20px', textAlign: 'center', color: 'var(--dark-400)', fontSize: '12px', textTransform: 'uppercase' }}>Pass Rate</th>
                  <th style={{ padding: '14px 20px', textAlign: 'center', color: 'var(--dark-400)', fontSize: '12px', textTransform: 'uppercase' }}>Avg Score</th>
                  <th style={{ padding: '14px 20px', textAlign: 'center', color: 'var(--dark-400)', fontSize: '12px', textTransform: 'uppercase' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {exams?.length > 0 ? exams.map(exam => (
                  <tr key={exam._id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '14px 20px', color: 'var(--text-main)' }}>
                      <div style={{ fontWeight: '500' }}>{exam.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--dark-400)' }}>{exam.subject} • {new Date(exam.date).toLocaleDateString()}</div>
                    </td>
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
                    <td style={{ padding: '14px 20px', textAlign: 'center', color: 'var(--text-main)' }}>
                      {exam.totalSubmitted || 0}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                      {exam.totalSubmitted > 0 ? (
                        <span style={{ color: (exam.totalPassed / exam.totalSubmitted) >= 0.5 ? '#10b981' : '#ef4444' }}>
                          {Math.round((exam.totalPassed / exam.totalSubmitted) * 100)}%
                        </span>
                      ) : (
                        <span style={{ color: 'var(--dark-400)' }}>-</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'center', color: 'var(--text-main)' }}>
                      {exam.totalSubmitted > 0 ? (
                        `${((exam.averageScore || 0) / (exam.maxMarks || 100) * 100).toFixed(1)}%`
                      ) : (
                        <span style={{ color: 'var(--dark-400)' }}>-</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                      <button 
                        className="btn-secondary" 
                        style={{ padding: '4px 12px', fontSize: '12px' }}
                        onClick={() => setSelectedExam(exam._id)}
                      >
                        View Results
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--dark-400)' }}>
                      No exams available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : isLoading ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: 'var(--dark-400)' }}>Loading results...</p>
        </div>
      ) : selectedExam ? (
        <div className="segmented-results" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ padding: '20px', background: 'var(--dark-200)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <button 
                className="btn-secondary" 
                style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={() => setSelectedExam('')}
              >
                ← Back
              </button>
              <h3 style={{ color: 'var(--text-main)', margin: 0 }}>Results for "{selectedExamDetails?.title}"</h3>
            </div>
            <span style={{ color: 'var(--dark-400)', fontSize: '14px' }}>Total Submissions: {results ? results.length : 0}</span>
          </div>

          {!results || results.length === 0 ? (
            <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
              <p style={{ color: 'var(--dark-400)', fontSize: '16px' }}>
                No students have submitted this exam yet.
              </p>
            </div>
          ) : (
            <>
              <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="card">
                  <h3 style={{ color: '#10b981', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    ✅ Passing Students
                  </h3>
                  {results.filter(r => r.isPassed).length > 0 ? (
                    <div style={{ overflowX: 'auto', maxHeight: '400px' }}>
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
                              <td style={{ padding: '10px', color: 'var(--text-main)' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span>{result.studentId?.name || 'Unknown'}</span>
                                  <span style={{ fontSize: '11px', color: 'var(--dark-400)' }}>{result.studentId?.email}</span>
                                </div>
                              </td>
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
                    <div style={{ overflowX: 'auto', maxHeight: '400px' }}>
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
                              <td style={{ padding: '10px', color: 'var(--text-main)' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span>{result.studentId?.name || 'Unknown'}</span>
                                  <span style={{ fontSize: '11px', color: 'var(--dark-400)' }}>{result.studentId?.email}</span>
                                </div>
                              </td>
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

              {results.some(r => r.tabSwitches > 0) && (
                <div className="card">
                  <h3 style={{ color: '#ef4444', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    ⚠️ Students Flagged for Cheating
                  </h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                        <tr>
                          <th style={{ padding: '12px', textAlign: 'left', color: '#ef4444', fontSize: '12px', textTransform: 'uppercase' }}>Student Name</th>
                          <th style={{ padding: '12px', textAlign: 'left', color: '#ef4444', fontSize: '12px', textTransform: 'uppercase' }}>Tab Switches</th>
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
                            <td style={{ padding: '12px', color: '#ef4444', fontWeight: 'bold' }}>{result.tabSwitches} times</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ) : null}
    </div>
  )
}

export default TeacherResults