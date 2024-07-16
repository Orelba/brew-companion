import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { InventoryProvider } from './contexts/InventoryContext'
import Layout from './layouts/Layout'
import HomePage from './pages/HomePage/HomePage'
import NotFoundPage from './pages/NotFoundPage/NotFoundPage'
import BrewsPage from './pages/BrewsPage/BrewsPage'
import InventoryLayout from './layouts/InventoryLayout'
import CoffeesPage from './pages/CoffeesPage/CoffeesPage'
import RoasteriesPage from './pages/RoasteriesPage/RoasteriesPage'

const Router = () => {
  // Initialize a browser router
  const router = createBrowserRouter([
    {
      // Parent route component that wraps all the routes
      element: <Layout />,
      errorElement: <NotFoundPage />,
      children: [
        {
          path: '/',
          element: <HomePage />,
        },
        {
          path: '/brews',
          element: <BrewsPage />,
        },
        {
          path: '/inventory',
          element: (
            <InventoryProvider>
              <InventoryLayout />
            </InventoryProvider>
          ),
          children: [
            {
              index: true,
              element: <Navigate to="coffees" replace />,
            },
            {
              path: 'coffees',
              element: <CoffeesPage />,
            },
            {
              path: 'roasteries',
              element: <RoasteriesPage />,
            },
          ],
        },
        // Error page for 404 status code (Not Found)
        {
          path: '*',
          element: <NotFoundPage />,
        },
      ],
    },
  ])

  return <RouterProvider router={router} />
}

export default Router
