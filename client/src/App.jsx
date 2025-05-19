import { AuthProvider } from './contexts/AuthProvider'
import {
  createTheme,
  DirectionProvider,
  Drawer,
  Modal,
  MantineProvider,
} from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { LoadingScreenProvider } from './contexts/LoadingScreenContext'
import { Notifications } from '@mantine/notifications'
import { generateColors } from '@mantine/colors-generator'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Router from './Router'
import 'non.geist' // Vercel Geist Sans Font
import { useTranslation } from 'react-i18next'
import ContentLoader from './components/ContentLoader/ContentLoader'

const App = () => {
  // Initialize the query client for React Query
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Fetch data if 2.5 minutes have passed since the last fetch
        staleTime: 2.5 * (1000 * 60),
        retry: false,
      },
    },
  })

  const { i18n, ready } = useTranslation()

  // Set the direction of the document based on the language
  document.dir = i18n.dir()

  // Set the font based on the language
  const fontForLanguage =
    i18n.resolvedLanguage === 'he' ? 'Open Sans' : 'Geist Variable'

  // Bug fix: Prevent right margin due to use of react-remove-scroll in Mantine (Only when document direction is RTL)
  const RTLMarginFix = {
    styles: {
      inner: { right: 0 },
    },
  }

  // Override the default Mantine theme
  const theme = createTheme({
    fontFamily: `${fontForLanguage}, sans-serif`,
    headings: { fontFamily: `${fontForLanguage}, sans-serif` },
    colors: {
      brown: generateColors('#694227'),
    },
    primaryColor: 'brown',
    components: {
      Drawer: Drawer.extend(RTLMarginFix),
      Modal: Modal.extend(RTLMarginFix),
    },
  })

  return (
    <AuthProvider>
      <DirectionProvider>
        <MantineProvider theme={theme}>
          <ModalsProvider>
            <LoadingScreenProvider>
              <Notifications />
              {ready ? (
                <QueryClientProvider client={queryClient}>
                  <Router />
                </QueryClientProvider>
              ) : (
                <ContentLoader visible transitionProps={{ duration: 0 }} />
              )}
            </LoadingScreenProvider>
          </ModalsProvider>
        </MantineProvider>
      </DirectionProvider>
    </AuthProvider>
  )
}

export default App
