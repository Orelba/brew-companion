import { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import { AppShell, rem } from '@mantine/core'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import ScrollToTop from '../components/ScrollToTop/ScrollToTop'
import LoadingScreenContext from '../contexts/LoadingScreenContext'
import ContentLoader from '../components/ContentLoader/ContentLoader'

const Layout = () => {
  const { isLoading, loadingText } = useContext(LoadingScreenContext)

  return (
    <AppShell
      styles={{
        main: {
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1, // Ensure the main section grows to fill available space
        },
      }}
      header={{ height: rem(56) }}
      footer={{ height: rem(70) }}
    >
      <Header />

      <AppShell.Main>
        <ScrollToTop />
        <ContentLoader visible={isLoading} text={loadingText} />
        <Outlet />
      </AppShell.Main>

      <Footer />
    </AppShell>
  )
}

export default Layout
