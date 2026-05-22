import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ActionIcon,
  Button,
  Group,
  Modal,
  NumberInput,
  SimpleGrid,
  Stack,
  Stepper,
  TextInput,
  Textarea,
  rem,
  useMantineTheme,
} from '@mantine/core'
import { TimeInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { useMediaQuery } from '@mantine/hooks'
import { IconArrowNarrowLeft } from '@tabler/icons-react'

import { fetchBrewingMethods } from '../../services/brewingMethodsService'
import { fetchBrewForUpdate } from '../../services/brewsService'
import { fetchCoffees } from '../../services/coffeesService'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useCreateBrew from '../../hooks/mutations/useCreateBrew'
import useUpdateBrew from '../../hooks/mutations/useUpdateBrew'

import ButtonCard from '../ButtonCard/ButtonCard'
import ExtractionRating from '../ExtractionRating/ExtractionRating'

const BrewForm = ({ opened, onClose, getInitialValues, brewIdToUpdate }) => {
  const theme = useMantineTheme()
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`)

  // Authenticated Axios instance
  const axiosPrivate = useAxiosPrivate()

  const { t, i18n } = useTranslation()

  const maxFormSteps = 2

  // Determine the initial step based on whether it's a quick brew (getInitialValues) or an update form (brewIdToUpdate)
  const initialStep = getInitialValues || brewIdToUpdate ? 2 : 0

  const [active, setActive] = useState(initialStep)

  const isUpdateMode = opened && !!brewIdToUpdate

  // Form mangement and validation
  const form = useForm({
    initialValues: {
      brewingMethod: '',
      coffee: '',
      grindSetting: '',
      rating: 0,
      time: '',
      temperature: '',
      dose: '',
      yield: '',
      notes: '',
    },

    validate: (values) => {
      if (active === 2) {
        return {
          grindSetting:
            values.grindSetting.trim() === ''
              ? t('newBrewForm.inputs.grindSetting.error')
              : null,
          // Validate 00:00 or 00:00:00 format
          time:
            values.time === '' ||
            /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(values.time)
              ? null
              : t('newBrewForm.inputs.time.error'),
          temperature:
            values.temperature !== '' &&
            (typeof values.temperature !== 'number' ||
              values.temperature < 0 ||
              values.temperature > 100)
              ? t('newBrewForm.inputs.temperature.error')
              : null,
          dose:
            values.dose !== '' &&
            (typeof values.dose !== 'number' || values.dose < 1)
              ? t('newBrewForm.inputs.dose.error')
              : null,
          yield:
            values.yield !== '' &&
            (typeof values.yield !== 'number' || values.yield < 1)
              ? t('newBrewForm.inputs.yield.error')
              : null,
        }
      }
    },
  })

  // Use a ref to access the form instance inside useEffect without causing it to re-run when form state changes
  const formRef = useRef(form)

  // Quick Brew: set form values to supplied initial values
  useEffect(() => {
    if (opened && getInitialValues) {
      const { coffee, brewingMethod } = getInitialValues()

      formRef.current.setFieldValue('coffee', coffee._id)
      formRef.current.setFieldValue('brewingMethod', brewingMethod._id)
    }
  }, [opened, getInitialValues])

  // Get the details of the brew to update (In case of an update form)
  const { data: brewToUpdate, isFetching } = useQuery({
    queryKey: ['brews', brewIdToUpdate],
    queryFn: () => fetchBrewForUpdate(brewIdToUpdate, axiosPrivate),
    // This query is enabled only when the form is opened and it is an update form
    enabled: isUpdateMode,
    gcTime: 0,
    staleTime: 0,
  })

  // Set the details of the brew to update (In case of an update form)
  useEffect(() => {
    if (isUpdateMode && brewToUpdate && !isFetching) {
      formRef.current.setValues(brewToUpdate)
    }
  }, [isUpdateMode, brewToUpdate, isFetching])

  // Move forward and back in the form
  const nextStep = () =>
    setActive((current) => (current < maxFormSteps ? current + 1 : current))
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current))

  // Handle click on coffee or brewing method card (Select and go to next step)
  const handleCardSelection = (field, value) => {
    if (active < maxFormSteps) {
      nextStep()
      form.setFieldValue(field, value)
    }
  }

  // Get all brewing methods
  const { data: brewingMethods } = useQuery({
    queryKey: ['brewingMethods'],
    queryFn: () => fetchBrewingMethods(axiosPrivate),
    placeholderData: [],
  })

  const brewingMethodCards = brewingMethods.map((method) => (
    <ButtonCard
      key={method._id}
      h={rem(170)}
      title={t(method.name)}
      image={method.image}
      onClick={() => handleCardSelection('brewingMethod', method._id)}
    />
  ))

  // Get all coffees
  const { data: coffees } = useQuery({
    queryKey: ['coffees'],
    queryFn: () => fetchCoffees(axiosPrivate),
    placeholderData: [],
  })

  const coffeeCards = coffees
    .filter((coffee) => !coffee.archived) // Filter out archived coffees
    .map((coffee) => (
      <ButtonCard
        key={coffee._id}
        h={rem(170)}
        text={coffee.name}
        textLineClamp={4}
        onClick={() => handleCardSelection('coffee', coffee._id)}
        image='coffee-beans.webp'
      />
    ))

  // Get the name of a document by its object id (coffee / brewing method)
  const getTruncatedDocumentNameByObjectId = (id, data) => {
    const item = data?.find((item) => item._id === id)
    if (!item) return null

    const name = t(item.name)

    // Truncate the name so it fits well in the stepper
    const maxLength = 28
    const truncatedName =
      name.length > maxLength ? name.slice(0, maxLength - 3) + '...' : name

    return truncatedName
  }

  // Close the modal and reset the stepper
  const closeAndReset = () => {
    onClose()
    setActive(initialStep)
    form.reset()
  }

  const createMutation = useCreateBrew({ coffees, brewingMethods })
  const updateMutation = useUpdateBrew({ coffees, brewingMethods })

  // Prevent duplicate submissions
  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const handleSaveBrew = () => {
    if (isSubmitting) return

    form.validate()

    if (form.isValid()) {
      // Check if the brew already exists (if it has an _id field it does)
      if (brewIdToUpdate) {
        updateMutation.mutate(form.getValues())
      } else {
        createMutation.mutate(form.getValues())
      }
      onClose()
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      onExitTransitionEnd={closeAndReset}
      fullScreen={isMobile}
      size='xl'
      onClick={(event) => event.stopPropagation()}
    >
      <Stepper active={active} onStepClick={setActive}>
        {/* Choose Brewing Method */}
        <Stepper.Step
          label={t('newBrewForm.stepOneTitle')}
          description={
            (active > 0 &&
              getTruncatedDocumentNameByObjectId(
                form.getValues().brewingMethod,
                brewingMethods
              )) ||
            t('newBrewForm.stepOneDescription')
          }
        >
          <SimpleGrid cols={{ base: 2, xs: 3 }} mt='lg' mb='lg'>
            {brewingMethodCards}
          </SimpleGrid>
        </Stepper.Step>

        {/* Choose Coffee */}
        <Stepper.Step
          label={t('newBrewForm.stepTwoTitle')}
          description={
            (active > 1 &&
              getTruncatedDocumentNameByObjectId(
                form.getValues().coffee,
                coffees
              )) ||
            t('newBrewForm.stepTwoDescription')
          }
          allowStepSelect={false}
        >
          <SimpleGrid
            mt='lg'
            mb='lg'
            cols={{ base: 2, xs: 3 }}
            style={{ overflowY: 'auto', maxHeight: '60vh' }}
          >
            {coffeeCards}
          </SimpleGrid>
        </Stepper.Step>

        {/* Add Brew Details */}
        <Stepper.Step
          label={t('newBrewForm.stepThreeTitle')}
          description={t('newBrewForm.stepThreeDescription')}
          allowStepSelect={false}
        >
          <Stack mt='lg' mb='lg'>
            <TextInput
              label={t('newBrewForm.inputs.grindSetting.label')}
              withAsterisk
              key={form.key('grindSetting')}
              {...form.getInputProps('grindSetting')}
            />
            <Group grow='1' align='flex-start'>
              <TimeInput
                label={t('newBrewForm.inputs.time.label')}
                key={form.key('time')}
                {...form.getInputProps('time')}
              />
              <NumberInput
                label={t('newBrewForm.inputs.temperature.label')}
                clampBehavior='strict'
                allowNegative={false}
                min={0}
                max={100}
                decimalScale={1}
                key={form.key('temperature')}
                {...form.getInputProps('temperature')}
              />
            </Group>
            <Group grow='1' align='flex-start'>
              <NumberInput
                label={t('newBrewForm.inputs.dose.label')}
                allowNegative={false}
                min={1}
                decimalScale={1}
                key={form.key('dose')}
                {...form.getInputProps('dose')}
              />
              <NumberInput
                label={t('newBrewForm.inputs.yield.label')}
                allowNegative={false}
                min={1}
                decimalScale={1}
                key={form.key('yield')}
                {...form.getInputProps('yield')}
              />
            </Group>
            <Textarea
              label={t('newBrewForm.inputs.notes.label')}
              key={form.key('notes')}
              {...form.getInputProps('notes')}
            />
            <ExtractionRating rating={form.getValues().rating} form={form} />
          </Stack>
        </Stepper.Step>
      </Stepper>

      <Group justify='space-between'>
        <ActionIcon
          size={36}
          variant='subtle'
          onClick={prevStep}
          disabled={active === 0 || !!getInitialValues}
        >
          <IconArrowNarrowLeft
            size='100%'
            style={{
              transform: i18n.dir() === 'rtl' ? 'scaleX(-1)' : undefined,
            }}
          />
        </ActionIcon>
        {active === 2 && (
          <Button
            variant='outline'
            onClick={handleSaveBrew}
            disabled={isSubmitting}
          >
            {t('newBrewForm.save')}
          </Button>
        )}
      </Group>
    </Modal>
  )
}

export default BrewForm
