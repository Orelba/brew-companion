import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
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
import { useDebouncedCallback, useMediaQuery } from '@mantine/hooks'
import { IconArrowNarrowLeft } from '@tabler/icons-react'

import { fetchBrewingMethods } from '../../services/brewingMethodsService'
import {
  createBrew,
  fetchBrewForUpdate,
  updateBrew,
} from '../../services/brewsService'
import { fetchCoffees } from '../../services/coffeesService'

import ButtonCard from '../ButtonCard/ButtonCard'
import ExtractionRating from '../ExtractionRating/ExtractionRating'

const BrewForm = ({ opened, onClose, getInitialValues, brewIdToUpdate }) => {
  const navigate = useNavigate()
  const theme = useMantineTheme()
  const matchesSmallScreen = useMediaQuery(
    `(max-width: ${theme.breakpoints.xs})`
  )

  // Access the global queryClient instance
  const queryClient = useQueryClient()

  // Get the translations for the page
  const { t, i18n } = useTranslation()

  // Max steps in stepper
  const maxFormSteps = 2

  // Current active step
  const [active, setActive] = useState(
    getInitialValues || brewIdToUpdate ? 2 : 0
  )

  // Check if it's an update form
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
    queryFn: () => fetchBrewForUpdate(brewIdToUpdate),
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
    queryFn: fetchBrewingMethods,
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
    queryFn: fetchCoffees,
    placeholderData: [],
  })

  const coffeeCards = coffees.map((coffee) => (
    <ButtonCard
      key={coffee._id}
      h={rem(170)}
      text={coffee.name}
      textLineClamp={4}
      onClick={() => handleCardSelection('coffee', coffee._id)}
      image='coffee-beans.jpg'
    />
  ))

  // Get the name of a document by its object id (coffee / brewing method)
  const getTruncatedDocumentNameByObjectId = (id, data) => {
    const item = data.find((item) => item._id === id)
    if (!item) return null

    const name = t(item.name)

    // Truncate the name so it fits well in the stepper
    const maxLength = 28
    const truncatedName =
      name.length > maxLength ? name.slice(0, maxLength - 3) + '...' : name

    // Return truncated name
    return truncatedName
  }

  // Reset the stepper after closing the modal
  const debouncedReset = useDebouncedCallback(() => {
    setActive(getInitialValues || brewIdToUpdate ? 2 : 0)
    form.reset()
  }, 200) // 200ms is the transition duration of the modal

  // Close the modal and reset the stepper
  const closeAndReset = () => {
    onClose()
    debouncedReset()
  }

  const generateOptimisticBrewFromFormValues = (formValues) => {
    const coffeeName = coffees.find(
      (coffee) => coffee._id === formValues.coffee
    )?.name

    const brewingMethod = brewingMethods.find(
      (brewingMethod) => brewingMethod._id === formValues.brewingMethod
    )

    const OptimisticBrewObject = {
      coffee: {
        _id: formValues.coffee,
        name: coffeeName || t('accordionItemWithMenu.savingBrew'),
        archived: false,
        roastery: {
          _id: '',
          name: '',
          country: '',
        },
      },
      date: '2024-05-24T02:08:20.344Z',
      dose: formValues.dose,
      grindSetting: formValues.grindSetting,
      brewingMethod: {
        _id: formValues.brewingMethod,
        name: t(brewingMethod?.name),
        image: brewingMethod?.image,
      },
      notes: formValues.notes,
      rating: formValues.rating,
      temperature: formValues.temperature,
      time: formValues.time,
      yield: formValues.yield,
      __v: 0,
      // the id is checked in the AccordionItemWithMenu so the menu is disabled if it's an optimistic update placeholder
      _id: 'optimistic',
    }

    return OptimisticBrewObject
  }

  // Create a mutation to send a new brew to the log
  const createMutation = useMutation({
    mutationFn: createBrew,
    onMutate: async (newBrew) => {
      await queryClient.cancelQueries({ queryKey: ['brews'] })

      const previousBrews = queryClient.getQueryData(['brews'])

      queryClient.setQueryData(['brews'], (oldData) => {
        const optimisticBrew = generateOptimisticBrewFromFormValues(newBrew)
        return oldData ? [optimisticBrew, ...oldData] : [optimisticBrew]
      })

      return { previousBrews }
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['brews'], context.previousBrews)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['brews'] })
      queryClient.invalidateQueries({ queryKey: ['latestBrews'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateBrew,
    onMutate: async (updatedBrew) => {
      await queryClient.cancelQueries({ queryKey: ['brews'] })

      const previousBrew = queryClient.getQueryData(['brews'])

      queryClient.setQueryData(['brews'], (oldData) => {
        const optimisticBrew = generateOptimisticBrewFromFormValues(updatedBrew)

        const newData = oldData.map((brew) => {
          if (brew._id === updatedBrew._id) {
            return optimisticBrew
          } else {
            return brew
          }
        })

        return oldData ? newData : [optimisticBrew]
      })

      return { previousBrew, updatedBrew }
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ['brews', context.updatedBrew._id],
        context.previousBrew
      )
    },
    onSettled: (updatedBrew, err, variables, context) => {
      console.log('settle', context.updatedBrew._id)
      queryClient.invalidateQueries({ queryKey: ['brews'] })
      queryClient.invalidateQueries({ queryKey: ['latestBrews'] })
      queryClient.invalidateQueries({
        queryKey: ['brews', context.updatedBrew._id],
      })
    },
  })

  const handleSaveBrew = () => {
    // Validate and show errors if found
    form.validate()

    if (form.isValid()) {
      // Check if the brew already exists (if it has an _id field it does)
      if (brewIdToUpdate) {
        // Update an existing brew
        updateMutation.mutate(form.getValues())
      } else {
        // Save a new brew
        createMutation.mutate(form.getValues())
      }

      closeAndReset()

      if (getInitialValues) navigate('/brews')
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={closeAndReset}
      fullScreen={matchesSmallScreen}
      size='xl'
      // mih={10} // TODO: FIX OR DELETE
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
                // withSeconds
                key={form.key('time')}
                {...form.getInputProps('time')}
              />
              <NumberInput
                label={t('newBrewForm.inputs.temperature.label')}
                clampBehavior='strict'
                allowNegative={false}
                min={0}
                max={100}
                key={form.key('temperature')}
                {...form.getInputProps('temperature')}
              />
            </Group>
            <Group grow='1' align='flex-start'>
              <NumberInput
                label={t('newBrewForm.inputs.dose.label')}
                allowNegative={false}
                min={1}
                key={form.key('dose')}
                {...form.getInputProps('dose')}
              />
              <NumberInput
                label={t('newBrewForm.inputs.yield.label')}
                allowNegative={false}
                min={1}
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
          <Button variant='outline' onClick={handleSaveBrew}>
            {t('newBrewForm.save')}
          </Button>
        )}
      </Group>
    </Modal>
  )
}

export default BrewForm
