import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './Pages/Home'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import RootLayout from './Layouts/RootLayout'
import Game from './Pages/Game'
import ErrorPage from './Pages/ErrorPage'

const router = createBrowserRouter([
  {
    element: <RootLayout/>,
    errorElement: <ErrorPage />,
    children: [  
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/game/:game_id',
        element: <Game/>
      },
    ]
  }
])

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App
