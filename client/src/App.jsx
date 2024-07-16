import {
  createTheme,
  DirectionProvider,
  Drawer,
  Modal,
  MantineProvider,
  LoadingOverlay,
} from '@mantine/core'
import { generateColors } from '@mantine/colors-generator'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Router from './Router'
import 'non.geist' // Vercel Geist Sans Font
import { useTranslation } from 'react-i18next'
import LoaderLogo from './components/LoaderLogo/LoaderLogo'

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
    <DirectionProvider>
      <MantineProvider
        theme={theme}
        // defaultColorScheme='dark' // TODO: add a dark mode toggle
      >
        {ready ? (
          <QueryClientProvider client={queryClient}>
            <Router />
          </QueryClientProvider>
        ) : (
          <LoadingOverlay
            visible
            loaderProps={{ children: <LoaderLogo /> }}
            overlayProps={{ radius: 'sm', blur: 2 }}
            transitionProps={{ duration: 0 }}
          />
        )}
      </MantineProvider>
    </DirectionProvider>
  )
}

export default App
