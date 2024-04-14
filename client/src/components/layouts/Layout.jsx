import { Outlet } from 'react-router-dom'
import { AppShell } from '@mantine/core'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'

const Layout = () => {

  return (
    // FIXME: Header Height base xs sm md lg xl
    <AppShell header={{ height: '3.5rem' }} footer={{ height: '1.6rem' }}>
      <Header />

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>

      <Footer />
    </AppShell>
  )
}

export default Layout
