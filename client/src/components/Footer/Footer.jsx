import { AppShellFooter, Anchor, Container, Group, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { APP_NAME } from '../../constants'
import styles from './footer.module.scss'

export function Footer() {
  const { t } = useTranslation()

  const links = [
    { link: '/contact', label: t('footer.links.contact') },
    { link: '/privacy', label: t('footer.links.privacy') },
    { link: '/terms', label: t('footer.links.tos') },
    {
      link: 'https://ko-fi.com/orelba',
      label: t('footer.links.supportMe'),
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
