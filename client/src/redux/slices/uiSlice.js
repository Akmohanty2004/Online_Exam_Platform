import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  theme: 'dark',
  sidebarOpen: true,
  loading: false,
  modal: null,
  notifications: []
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    showModal: (state, action) => {
      state.modal = action.payload
    },
    hideModal: (state) => {
      state.modal = null
    }
  }
})

export const { toggleSidebar, setLoading, showModal, hideModal } = uiSlice.actions
export default uiSlice.reducer