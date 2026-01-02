import { AppShellFooter, Anchor, Container, Group, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { APP_NAME } from '../../constants'
import styles from './footer.module.scss'

export function Footer() {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'

  const links = [
    { link: '#', label: t('footer.links.contact') }, // TODO: Create contact route and page
    { link: '/privacy', label: t('footer.links.privacy') },
    { link: '/terms', label: t('footer.links.tos') },
    {
      link: 'https://www.buymeacoffee.com/orelba',
      label: isRTL ? 'Buy me a coffee ☕' : '☕ Buy me a coffee',
    },
  ]

  const items = links.map((link) => (
    <Anchor
      c='dimmed'
      key={link.label}
      href={link.link}
      target={link.link.startsWith('http') ? '_blank' : '_self'}
      rel={link.link.startsWith('http') ? 'noopener noreferrer' : undefined}
      size='xs'
    >
      {link.label}
    </Anchor>
  ))

  return (
    <AppShellFooter className={styles.footer}>
      <Container className={styles.inner}>
        <Text size='xs' c='dimmed'>
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
