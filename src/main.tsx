import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { loader } from './loader'
import FilterPage from './FilterPage'
import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <FilterPage />,
    loader: loader,
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)