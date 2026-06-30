import React from 'react'

const LoadingSpinner = ({ size = 40, color = 'primary' }) => {
  return (
    <div 
      className="loading-spinner"
      style={{
        width: size,
        height: size,
        borderWidth: size / 10,
        borderColor: color === 'primary' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.1)',
        borderTopColor: color === 'primary' ? 'var(--primary-500)' : 'white'
      }}
    />
  )
}

export default LoadingSpinner