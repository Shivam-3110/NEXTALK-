import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext.jsx'
import {ChatProvider} from '../context/ChatContext.jsx'
import { TaskProvider } from '../context/TaskContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <ChatProvider>
        <TaskProvider>
          <App />
        </TaskProvider>
      </ChatProvider>
    </AuthProvider>
  </BrowserRouter>,
)
