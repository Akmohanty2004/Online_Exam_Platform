import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const getNotifications = createAsyncThunk(
  'notifications/getNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/notifications')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get notifications')
    }
  }
)

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`)
      return notificationId
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark as read')
    }
  }
)

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await axios.put('/api/notifications/mark-all-read')
      return true
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark all as read')
    }
  }
)

const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null
}

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload)
      state.unreadCount += 1
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.isLoading = false
        state.notifications = action.payload.notifications || []
        state.unreadCount = action.payload.unreadCount || 0
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n._id === action.payload)
        if (notification && !notification.isRead) {
          notification.isRead = true
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        }
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach(n => { n.isRead = true })
        state.unreadCount = 0
      })
  }
})

export const { addNotification } = notificationSlice.actions
export default notificationSlice.reducer