import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import InventoryContext from '../../contexts/InventoryContext'
import { useDisclosure } from '@mantine/hooks'
import RoasteryForm from '../RoasteryForm/RoasteryForm'
import CoffeeForm from '../CoffeeForm/CoffeeForm'
import BrewForm from '../BrewForm/BrewForm'
import {
  Card,
  Text,
  Group,
  ThemeIcon,
  Stack,
  useComputedColorScheme,
} from '@mantine/core'
import { PiStorefrontLight } from 'react-icons/pi'
import { CiCoffeeBean } from 'react-icons/ci'
import { BsCupHot } from 'react-icons/bs'

const GettingStarted = ({ hasRoasteries, hasCoffees, hasBrews }) => {
  const { t } = useTranslation()

  const { roasteries } = useContext(InventoryContext)

  // Form modals state management
  const [
    isRoasteryFormOpened,
    { open: openRoasteryForm, close: closeRoasteryForm },
  ] = useDisclosure()
  const [isCoffeeFormOpened, { open: openCoffeeForm, close: closeCoffeeForm }] =
    useDisclosure()
  const [isBrewFormOpened, { open: openBrewForm, close: closeBrewForm }] =
    useDisclosure()

  const computedColorScheme = useComputedColorScheme()
  const isDark = computedColorScheme === 'dark'

  const steps = [
    {
      title: t('gettingStarted.step1Title'),
      doneTitle: t('gettingStarted.step1DoneTitle'),
      done: hasRoasteries,
      icon: <PiStorefrontLight />,
      disabled: false,
      onClick: openRoasteryForm,
    },
    {
      title: t('gettingStarted.step2Title'),
      doneTitle: t('gettingStarted.step2DoneTitle'),
      done: hasCoffees,
      icon: <CiCoffeeBean />,
      disabled: !hasRoasteries,
      onClick: openCoffeeForm,
    },
    {
      title: t('gettingStarted.step3Title'),
      doneTitle: t('gettingStarted.step3DoneTitle'),
      done: hasBrews,
      icon: <BsCupHot />,
      disabled: !hasRoasteries || !hasCoffees,
      onClick: openBrewForm,
    },
  ]

  return (
    <>
      <Stack
        spacing='xl'
        align='center'
        py='5rem'
        sx={{ width: '100%', maxWidth: 400, margin: '3rem auto' }}
      >
        {/* Title */}
        <Stack spacing={4} align='center'>
          <Text align='center' size='xl' weight={700}>
            {t('gettingStarted.title')}
          </Text>
          <Text align='center' c='dimmed'>
            {t('gettingStarted.subtitle')}
          </Text>
        </Stack>
        {/* Steps */}
        <Stack spacing='sm' sx={{ width: '100%' }}>
          {steps.map((step, index) => (
            <Card
              key={index}
              onClick={!step.done && !step.disabled ? step.onClick : undefined}
              shadow='xs'
              padding='md'
              radius='md'
              withBorder
              opacity={step.disabled ? 0.5 : 1}
              bg={step.done ? 'var(--mantine-color-green-light)' : undefined}
              c={step.done ? (isDark ? 'green.4' : 'green.9') : undefined}
              bd={
                step.done
                  ? '1px solid var(--mantine-color-green-filled)'
                  : step.disabled
                  ? '1px solid var(--mantine-color-gray-4)'
                  : '1px solid var(--mantine-color-blue-6)'
              }
              style={{
                boxShadow:
                  !step.disabled && !step.done
                    ? '0 0 0 2px var(--mantine-color-blue-3)'
                    : undefined,
                cursor: step.disabled || step.done ? 'default' : 'pointer',
              }}
            >
              <Group spacing='sm' align='center' w='80vw' maw='500px'>
                <ThemeIcon
                  color={step.done ? 'green' : 'gray'}
                  variant='light'
                  size='lg'
                >
                  {step.icon}
                </ThemeIcon>
                <Group justify='space-between' flex={1}>
                  <Text>{step.done ? step.doneTitle : step.title}</Text>
                  {step.done && (
                    <ThemeIcon color='green' variant='light' size='lg'>
                      ✓
                    </ThemeIcon>
                  )}
                </Group>
              </Group>
            </Card>
          ))}
        </Stack>
      </Stack>
      <RoasteryForm
        opened={isRoasteryFormOpened}
        closeFormModal={closeRoasteryForm}
      />
      <CoffeeForm
        opened={isCoffeeFormOpened}
        closeFormModal={closeCoffeeForm}
        roasteries={roasteries}
      />
      <BrewForm opened={isBrewFormOpened} onClose={closeBrewForm} />
    </>
  )
}

export default GettingStarted
