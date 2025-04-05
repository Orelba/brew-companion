import { createBrowserRouter, RouterProvider, Navigate } from 'react-router'
import PersistLogin from './components/PersistLogin/PersistLogin'
import RequireAuth from './components/RequireAuth/RequireAuth'
import { InventoryProvider } from './contexts/InventoryContext'
import Layout from './layouts/Layout'
import ProtectedHomePage from './pages/ProtectedHomePage/ProtectedHomePage'
import NotFoundPage from './pages/NotFoundPage/NotFoundPage'
import BrewsPage from './pages/BrewsPage/BrewsPage'
import InventoryLayout from './layouts/InventoryLayout'
import CoffeesPage from './pages/CoffeesPage/CoffeesPage'
import RoasteriesPage from './pages/RoasteriesPage/RoasteriesPage'
import AuthForm from './components/AuthForm/AuthForm'
import PasswordResetPage from './pages/PasswordResetPage/PasswordResetPage'

// TODO: Consider: Make the Authform get a state of type and go to /auth/login /auth/register /auth/reset-password
const Router = () => {
  // Initialize a browser router
  const router = createBrowserRouter([
    {
      // Parent route component that wraps all the routes
      element: (
        <PersistLogin>
          <Layout />
        </PersistLogin>
      ),
      errorElement: <NotFoundPage />,
      children: [
        {
          path: '/',
          element: <ProtectedHomePage />,
          children: [
            {
              path: '/auth',
              element: <AuthForm />,
            },
          ],
        },
        {
          path: '/reset-password/:token',
          element: <PasswordResetPage />,
        },
        {
          path: '/brews',
          element: (
            <RequireAuth>
              <BrewsPage />
            </RequireAuth>
          ),
        },
        {
          path: '/inventory',
          element: (
            <RequireAuth>
              <InventoryProvider>
                <InventoryLayout />
              </InventoryProvider>
            </RequireAuth>
          ),
          children: [
            {
              index: true,
              element: <Navigate to='coffees' replace />,
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
      ],
    },
    {
      path: '*',
      element: <NotFoundPage />,
    },
  ])

  return <RouterProvider router={router} />
}

export default Router
