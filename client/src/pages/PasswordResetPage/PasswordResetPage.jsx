import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useForm } from '@mantine/form'
import {
  PasswordInput,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from '@mantine/core'
import { useQuery, useMutation } from '@tanstack/react-query'
import {
  validatePasswordResetToken,
  resetPassword,
} from '../../services/authService'
import { notifications } from '@mantine/notifications'
import useLoadingScreen from '../../hooks/useLoadingScreen'

const PasswordResetPage = () => {
  const { t } = useTranslation()

  usePageTitle(t('pageTitles.passwordResetPage'))

  const navigate = useNavigate()

  const { token } = useParams()

  const { isLoading, isError, isSuccess } = useQuery({
    queryKey: ['validateResetPasswordToken', token],
    queryFn: () => validatePasswordResetToken(token),
    onError: () => {
      notifications.show({
        title: t('passwordResetPage.linkInvalid'),
        color: 'red',
      })
      // Go to home page
      navigate('/')
    },
    retry: false, // Disable retries for token validation
  })

  useLoadingScreen(isLoading, t('loading.passwordReset'))

  const form = useForm({
    initialValues: {
      password: '',
      confirmPassword: '',
    },

    validate: {
      password: (val) =>
        val.length < 8 ? t('auth.validation.passwordInvalid') : null,
      confirmPassword: (val, values) => {
        if (val.length < 8) {
          return t('auth.validation.passwordInvalid')
        }
        if (val !== values.password) {
          return t('auth.validation.passwordMismatch')
        }
        return null
      },
    },
  })

  const mutation = useMutation({
    mutationFn: (values) => resetPassword(values, token),
    onSuccess: () => {
      notifications.show({
        title: t('passwordResetPage.passwordResetSuccessful'),
        color: 'green',
      })
      // Go to login form
      navigate('/auth')
    },
    onError: () => {
      notifications.show({ title: t('notifications.unexpectedError') })
    },
  })

  const handleSubmit = async () => {
    const formValues = form.getValues()

    mutation.mutate(formValues)
  }

  useEffect(() => {
    if (isError) {
      notifications.show({
        title: t('passwordResetPage.linkInvalid'),
        color: 'red',
      })
      navigate('/')
    }
  }, [isError, navigate, t])

  if (isLoading) {
    return null
  }

  return (
    isSuccess && (
      <Container size={460} my={30}>
        <Title ta='center'>{t('passwordResetPage.title')}</Title>
        <Text c='dimmed' fz='sm' ta='center'>
          {t('passwordResetPage.subtitle')}
        </Text>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Paper withBorder shadow='md' p={30} radius='md' mt='xl'>
            <PasswordInput
              label={t('auth.inputs.passwordLabel')}
              placeholder={t('auth.inputs.passwordPlaceholder')}
              required
              mt='md'
              key={form.key('password')}
              {...form.getInputProps('password')}
            />
            <PasswordInput
              label={t('auth.inputs.confirmPasswordLabel')}
              placeholder={t('auth.inputs.confirmPasswordPlaceholder')}
              required
              mt='md'
              key={form.key('confirmPassword')}
              {...form.getInputProps('confirmPassword')}
            />
            <Group justify='space-between' mt='lg'>
              <Button type='submit' tt='capitalize'>
                {t('auth.resetPassword')}
              </Button>
            </Group>
          </Paper>
        </form>
      </Container>
    )
  )
}

export default PasswordResetPage
