import { DirectionProvider, MantineProvider } from '@mantine/core'
import { generateColors } from '@mantine/colors-generator'
import Router from './Router'
import 'non.geist' // Vercel Geist Sans Font
import { useTranslation } from 'react-i18next'

const App = () => {
  const { i18n, ready } = useTranslation()

  if (!ready) {
    return null // TODO: or a loading spinner, etc.
  }

  // Set the direction of the document based on the language
  document.dir = i18n.dir()
  console.log('APP RERENDERED')

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
        // defaultColorScheme="dark"
      >
        <Router />
      </MantineProvider>
    </DirectionProvider>
  )
}

export default App
