import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  TextInput,
  Textarea,
  Button,
  Select,
  Stack,
  Title,
  Text,
  Paper,
  useMantineTheme,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import PageTransitionWrapper from '../../components/PageTransitionWrapper/PageTransitionWrapper'
import { usePageTitle } from '../../hooks/usePageTitle'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useAuth from '../../hooks/useAuth'
import useUserInfo from '../../hooks/useUserInfo'
import useSendContactMessage from '../../hooks/mutations/useSendContactMessage'
// TODO: add captcha or some other anti-spam measure if spam becomes an issue
const ContactPage = () => {
  const { t } = useTranslation()

  usePageTitle(t('pageTitles.contactPage'))

  const theme = useMantineTheme()
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`)

  const { auth } = useAuth()
  const isAuthenticated = !!auth?.accessToken
  const { data: currentUser } = useUserInfo()

  const axiosPrivate = useAxiosPrivate()
  const { mutate, isPending } = useSendContactMessage(axiosPrivate)

  const [form, setForm] = useState({
    name: '',
    email: '',
    category: 'general',
    message: '',
  })

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    mutate(
      {
        name: isAuthenticated ? currentUser.username : form.name,
        email: isAuthenticated ? currentUser.email : form.email,
        category: form.category,
        message: form.message,
      },
      {
        onSuccess: () =>
          setForm({ name: '', email: '', category: 'general', message: '' }),
      }
    )
  }

  const categoryData = [
    { value: 'general', label: t('contactPage.categories.general') },
    { value: 'feedback', label: t('contactPage.categories.feedback') },
    { value: 'bug', label: t('contactPage.categories.bug') },
  ]

  return (
    <PageTransitionWrapper>
      <Paper
        maw={720}
        w={{ base: 'auto', sm: '100%' }}
        mx={{ base: 'auto', sm: 'auto' }}
        mt={{ base: 'md', sm: 'xl' }}
        p={{ base: 'md', sm: 'xl' }}
        withBorder={!isMobile}
        radius='md'
      >
        <Stack gap='xs' mb='lg'>
          <Title order={2}>{t('contactPage.title')}</Title>
          <Text c='dimmed' size='sm'>
            {t('contactPage.subtitle')}
          </Text>
        </Stack>
        <form onSubmit={handleSubmit}>
          <Stack gap='md'>
            <TextInput
              label={t('contactPage.fields.name')}
              placeholder={t('contactPage.placeholders.name')}
              value={
                isAuthenticated ? (currentUser?.username ?? '') : form.name
              }
              onChange={handleChange('name')}
              disabled={isAuthenticated}
              required
            />
            {!isAuthenticated && (
              <TextInput
                label={t('contactPage.fields.email')}
                type='email'
                placeholder={t('contactPage.placeholders.email')}
                value={form.email}
                onChange={handleChange('email')}
                required
              />
            )}
            <Select
              label={t('contactPage.fields.category')}
              data={categoryData}
              value={form.category}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, category: value }))
              }
              allowDeselect={false}
              required
            />
            <Textarea
              label={t('contactPage.fields.message')}
              placeholder={t('contactPage.placeholders.message')}
              rows={6}
              value={form.message}
              onChange={handleChange('message')}
              required
            />
            <Button type='submit' loading={isPending} fullWidth>
              {t('contactPage.submit')}
            </Button>
          </Stack>
        </form>
      </Paper>
    </PageTransitionWrapper>
  )
}

export default ContactPage
