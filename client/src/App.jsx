import { DirectionProvider, MantineProvider } from '@mantine/core'
import { generateColors } from '@mantine/colors-generator'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Router from './Router'
import 'non.geist' // Vercel Geist Sans Font
import { useTranslation } from 'react-i18next'

const App = () => {
  // Initialize the query client for React Query
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Fetch data if 2.5 minutes have passed since the last fetch
        staleTime: 2.5 * (1000 * 60),
      },
    },
  })

  const { i18n, ready } = useTranslation()

  if (!ready) {
    return null // TODO: or a loading spinner, etc.
  }

  // Set the direction of the document based on the language
  document.dir = i18n.dir()

  // Set the font based on the language
  const fontForLanguage =
    i18n.resolvedLanguage === 'he' ? 'Open Sans' : 'Geist Variable'

  return (
    <DirectionProvider>
      <MantineProvider
        theme={{
          fontFamily: `${fontForLanguage}, sans-serif`,
          headings: { fontFamily: `${fontForLanguage}, sans-serif` },
          colors: {
            brown: generateColors('#694227'),
          },
          primaryColor: 'brown',
        }}
        // defaultColorScheme="dark" // TODO: add a dark mode toggle
      >
        <QueryClientProvider client={queryClient}>
          <Router />
        </QueryClientProvider>
      </MantineProvider>
    </DirectionProvider>
  )
}

export default App
