import React from 'react'
import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a, #312e81)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Orbs */}
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        top: '-100px',
        right: '-100px',
        background: '#6366f1',
        borderRadius: '50%',
        filter: 'blur(80px)',
        opacity: 0.3,
        animation: 'float 8s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        width: '350px',
        height: '350px',
        bottom: '-100px',
        left: '-100px',
        background: '#8b5cf6',
        borderRadius: '50%',
        filter: 'blur(80px)',
        opacity: 0.3,
        animation: 'float 8s ease-in-out infinite',
        animationDelay: '2s'
      }} />
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(16, 185, 129, 0.15)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        animation: 'pulse-ring 4s ease-in-out infinite'
      }} />
      
      <Outlet />
    </div>
  )
}

export default AuthLayout