import { Outlet } from 'react-router-dom'
import { AppShell, rem } from '@mantine/core'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import ScrollToTop from '../components/ScrollToTop/ScrollToTop'

const Layout = () => {
  return (
    <AppShell header={{ height: rem(56) }}>
      <Header />

      <AppShell.Main>
        <ScrollToTop />
        <Outlet />
      </AppShell.Main>

      <Footer />
    </AppShell>
  )
}

export default Layout
