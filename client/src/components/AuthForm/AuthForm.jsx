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

const AuthForm = ({ opened, onClose }) => {
  // Get the translations for the form
  const { t } = useTranslation()

  const theme = useMantineTheme()
  const matchesSmallScreen = useMediaQuery(
    `(max-width: ${theme.breakpoints.xs})`
  )

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
          : t('authForm.validation.emailInvalid'),
      password: (val) =>
        val.length < 8 ? t('authForm.validation.passwordInvalid') : null,
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
    register: t('authForm.callToLogin'),
    login: t('authForm.callToRegister'),
    resetPassword: t('authForm.callToGoBack'),
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
          {t('authForm.welcome', { formType: t(`authForm.${type}`) })}
        </Text>
        <form onSubmit={form.onSubmit(() => {})}>
          <Stack>
            {type === 'register' && (
              <TextInput
                required
                label={t('authForm.inputs.usernameLabel')}
                placeholder={t('authForm.inputs.usernamePlaceholder')}
                radius='md'
                key={form.key('username')}
                {...form.getInputProps('username')}
              />
            )}
            <TextInput
              required
              label={t('authForm.inputs.emailLabel')}
              placeholder={t('authForm.inputs.emailPlaceholder')}
              radius='md'
              key={form.key('email')}
              {...form.getInputProps('email')}
            />
            {type !== 'resetPassword' && (
              <PasswordInput
                required
                label={t('authForm.inputs.passwordLabel')}
                placeholder={t('authForm.inputs.passwordPlaceholder')}
                radius='md'
                key={form.key('password')}
                {...form.getInputProps('password')}
              />
            )}
            {type === 'register' && (
              <Checkbox
                label={t('authForm.inputs.termsAndConditions')}
                key={form.key('terms')}
                {...form.getInputProps('terms', { type: 'checkbox' })}
              />
            )}
            {type === 'login' && (
              <Anchor
                component='button'
                type='button'
                c='dimmed'
                onClick={() => toggle('resetPassword')}
                size='xs'
                style={{ alignSelf: 'flex-start' }}
              >
                {t('authForm.forgotYourPassword')}
              </Anchor>
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
            <Button type='submit' radius='xl' tt='capitalize'>
              {t(`authForm.${type}`)}
            </Button>
          </Group>
        </form>
      </Paper>
    </Modal>
  )
}

export default AuthForm
