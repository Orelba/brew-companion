import { useState } from 'react'
import useAuth from '../../hooks/useAuth'
import { login, register, forgotPassword } from '../../services/AuthService'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Anchor,
  Button,
  Checkbox,
  Group,
  Modal,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useToggle, useMediaQuery, useDebouncedCallback } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'

const AuthForm = ({ opened, onClose }) => {
  // Get the translations for the form
  const { t } = useTranslation()

  const theme = useMantineTheme()
  const matchesSmallScreen = useMediaQuery(
    `(max-width: ${theme.breakpoints.xs})`
  )

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const { setAuth, persist, setPersist } = useAuth()

  // Seperate state for the "keep me signed in" checkbox to be able to set persist only on succesful login
  const [persistCheckbox, setPersistCheckbox] = useState(persist)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [type, toggle] = useToggle(['login', 'register', 'resetPassword'])
  const form = useForm({
    initialValues: {
      email: '',
      username: '',
      password: '',
      terms: true,
    },

    validate: {
      email: (val) =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val)
          ? null
          : t('auth.validation.emailInvalid'),
      password: (val) => {
        if (type === 'resetPassword') return null
        return val.length < 8 ? t('auth.validation.passwordInvalid') : null
      },
      terms: (val) => {
        // Only validate on register form
        if (type !== 'register') return null
        return val === true ? null : t('notifications.termsAgreementError')
      },
    },
  })

  const debouncedReset = useDebouncedCallback(() => {
    form.reset()
    toggle('login')
  }, 200) // 200ms is the transition duration of the modal

  const closeAndReset = () => {
    onClose()
    debouncedReset()
  }

  const callToSwitchFormType = {
    register: t('auth.callToLogin'),
    login: t('auth.callToRegister'),
    resetPassword: t('auth.callToGoBack'),
  }

  const handleLogin = async (formValues) => {
    try {
      const data = await login(formValues)
      const accessToken = data?.accessToken
      setAuth({ email: formValues.email, accessToken })

      // Set persist state both in auth context and local storage
      setPersist(persistCheckbox)
      localStorage.setItem('persist', persistCheckbox)

      notifications.show({
        title: t('notifications.loginSuccessful'),
        color: 'green',
      })

      closeAndReset()
      navigate(from, { replace: true })
    } catch (error) {
      notifications.show({ title: t(error.message), color: 'red' })
    }
  }

  const handleRegister = async (formValues) => {
    try {
      await register(formValues)

      notifications.show({
        title: t('notifications.registrationSuccessful'),
        color: 'green',
      })

      closeAndReset()
    } catch (error) {
      notifications.show({ title: t(error.message), color: 'red' })
    }
  }

  const handleResetPassword = async (formValues) => {
    try {
      const data = await forgotPassword(formValues)
      console.log(data)
      notifications.show({
        title: t('notifications.passwordResetEmailSent'),
        color: 'green',
      })

      closeAndReset()
    } catch (error) {
      notifications.show({ title: t(error.message), color: 'red' })
    }
  }

  const handleSubmit = async () => {
    if (isSubmitting) return

    setIsSubmitting(true)

    try {
      const formValues = form.getValues()

      if (type === 'login') {
        await handleLogin(formValues)
      } else if (type === 'register') {
        await handleRegister(formValues)
      } else if (type === 'resetPassword') {
        await handleResetPassword(formValues)
      }
    } catch (error) {
      console.error('Unexpected error during form submission:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePersist = () => {
    setPersistCheckbox((prevState) => !prevState)
  }

  return (
    <Modal
      opened={opened}
      onClose={closeAndReset}
      fullScreen={matchesSmallScreen}
      withCloseButton={false}
    >
      <Paper radius='md' p='lg'>
        <Text size='lg' fw={500} mb='sm'>
          {t('auth.welcome', { formType: t(`auth.${type}`) })}
        </Text>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            {type === 'register' && (
              <TextInput
                required
                label={t('auth.inputs.usernameLabel')}
                placeholder={t('auth.inputs.usernamePlaceholder')}
                radius='md'
                key={form.key('username')}
                {...form.getInputProps('username')}
              />
            )}
            <TextInput
              required
              label={t('auth.inputs.emailLabel')}
              placeholder={t('auth.inputs.emailPlaceholder')}
              radius='md'
              key={form.key('email')}
              {...form.getInputProps('email')}
            />
            {type !== 'resetPassword' && (
              <PasswordInput
                required
                label={t('auth.inputs.passwordLabel')}
                placeholder={t('auth.inputs.passwordPlaceholder')}
                radius='md'
                key={form.key('password')}
                {...form.getInputProps('password')}
              />
            )}
            {type === 'register' && (
              <Checkbox
                label={t('auth.inputs.termsAndConditions')}
                key={form.key('terms')}
                {...form.getInputProps('terms', { type: 'checkbox' })}
              />
            )}
            {type === 'login' && (
              <>
                <Checkbox
                  label={t('auth.persistLogin')}
                  onChange={togglePersist}
                  checked={persistCheckbox}
                />
                <Anchor
                  component='button'
                  type='button'
                  c='dimmed'
                  onClick={() => toggle('resetPassword')}
                  size='xs'
                  style={{ alignSelf: 'flex-start' }}
                >
                  {t('auth.forgotYourPassword')}
                </Anchor>
              </>
            )}
          </Stack>
          <Group justify='space-between' mt='xl'>
            <Anchor
              component='button'
              type='button'
              c='dimmed'
              onClick={() => (type === 'register' ? toggle('login') : toggle())}
              size='xs'
            >
              {callToSwitchFormType[type]}
            </Anchor>
            <Button
              type='submit'
              radius='xl'
              tt='capitalize'
              disabled={isSubmitting}
            >
              {t(`auth.${type}`)}
            </Button>
          </Group>
        </form>
      </Paper>
    </Modal>
  )
}

export default AuthForm
