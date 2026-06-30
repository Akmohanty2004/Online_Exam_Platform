export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatTime = (time) => {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const truncateText = (text, length = 50) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

export const getInitials = (name) => {
  if (!name) return 'U'
  return name.charAt(0).toUpperCase()
}

export const getStatusColor = (status) => {
  const colors = {
    'published': 'badge-info',
    'ongoing': 'badge-warning',
    'completed': 'badge-success',
    'cancelled': 'badge-danger',
    'draft': 'badge-secondary'
  }
  return colors[status] || 'badge-secondary'
}