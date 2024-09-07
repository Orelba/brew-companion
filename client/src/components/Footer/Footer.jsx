import { AppShellFooter, Anchor, Container, Group, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { APP_NAME } from '../../constants'
import styles from './footer.module.scss'

export function Footer() {
  const { t } = useTranslation()

  // TODO: Create routes
  const links = [
    { link: '#', label: t('footer.links.contact') },
    { link: '#', label: t('footer.links.privacy') },
    { link: '#', label: t('footer.links.tos') },
  ]

  const items = links.map((link) => (
    <Anchor
      c='dimmed'
      key={link.label}
      href={link.link}
      onClick={(event) => event.preventDefault()}
      size='sm'
    >
      {link.label}
    </Anchor>
  ))

  return (
    <AppShellFooter className={styles.footer}>
      <Container className={styles.inner}>
        <Text size='sm' c='dimmed'>
          {t('footer.text', {
            year: new Date().getFullYear(),
            appName: APP_NAME,
          })}
        </Text>
        <Group className={styles.links}>{items}</Group>
      </Container>
    </AppShellFooter>
  )
}

export default Footer
