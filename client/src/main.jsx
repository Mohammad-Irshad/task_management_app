import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import store from './app/store/store.js'
import {Provider} from 'react-redux'
import {RouterProvider, createBrowserRouter} from 'react-router-dom'
import UserSignup from './pages/UserSignup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ProtectedRoute from './pages/ProtectedRoute.jsx'
import Tasks from './pages/Tasks.jsx'

const router = createBrowserRouter([
  {
    path : '/',
    element : <App/>
  },
  {
    path : '/signup',
    element : <UserSignup/>
  },
  {
    path : '/dashboard',
    element : (
      <ProtectedRoute>
        <Dashboard/>
      </ProtectedRoute>
    )
  },
  {
    path : '/tasks',
    element : (
      <ProtectedRoute>
        <Tasks/>
      </ProtectedRoute>
    )
  }
])





createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StrictMode>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>    
    </StrictMode>
  </Provider>
  ,
)
