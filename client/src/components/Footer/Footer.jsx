import { AppShell } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { APP_NAME } from '../../constants'

const Footer = () => {
  const { t } = useTranslation()

  return (
    <AppShell.Footer
      style={{
        textAlign: 'center',
        color:
          'light-dark(var(--mantine-color-brown-9), var(--mantine-color-dark-0))',
      }}
    >
      {t('footer.text', { year: new Date().getFullYear(), appName: APP_NAME })}
    </AppShell.Footer>
  )
}

export default Footer
