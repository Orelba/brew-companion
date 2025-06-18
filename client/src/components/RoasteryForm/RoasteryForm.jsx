import {
  Button,
  Group,
  Modal,
  Rating,
  Select,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useMediaQuery } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { v4 as uuidv4 } from 'uuid'
import ContentLoader from '../../components/ContentLoader/ContentLoader'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import {
  createRoastery,
  fetchRoasteryForUpdate,
  updateRoastery,
} from '../../services/roasteriesService'
import useCountryOptions from '../../hooks/useCountryOptions'
import countries from 'i18n-iso-countries'

const RoasteryForm = ({
  opened,
  closeFormModal,
  roasteryIdToUpdate,
  onExited,
}) => {
  const theme = useMantineTheme()
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`)

  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()

  const { t } = useTranslation()

  const form = useForm({
    initialValues: {
      name: '',
      country: null,
      rating: 0,
    },
    validate: {
      name: (value) => {
        const trimmedValue = value.trim()
        if (trimmedValue.length < 1) return t('roasteryForm.inputs.name.error')
        if (trimmedValue.length > 50)
          return t('roasteryForm.inputs.name.tooLong')
        return null
      },
      country: (value) => {
        // Ensure value is a valid ISO 3166 alpha-2 country code
        if (!value || !countries.isValid(value))
          return t('roasteryForm.inputs.country.error')
        return null
      },
    },
  })

  const { options: countrySelectOptions } = useCountryOptions()

  const createMutation = useMutation({
    mutationFn: (newRoastery) => createRoastery(newRoastery, axiosPrivate),
    onMutate: async (newRoastery) => {
      await queryClient.cancelQueries({ queryKey: ['roasteries'] })

      const previousRoasteries = queryClient.getQueryData(['roasteries'])

      queryClient.setQueryData(['roasteries'], (old) => [
        {
          _id: `optimistic-${uuidv4()}`,
          optimistic: true,
          ...newRoastery,
          createdAt: new Date().toISOString(),
        },
        ...(old || []), // Ensure `old` is an array, fallback to an empty array if undefined
      ])

      return { previousRoasteries }
    },
    onSuccess: () => {
      notifications.show({
        title: t('notifications.roasterySaveSuccess'),
        color: 'green',
      })
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['roasteries'], context.previousRoasteries)
      notifications.show({
        title: t('notifications.roasterySaveError'),
        color: 'red',
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['roasteries'] })
    },
  })

  // Get the details of the roastery to update (In case of an update form)
  const { data: roasteryToUpdate, isFetching: isFetchingRoasteryToUpdate } =
    useQuery({
      queryKey: ['roasteries', roasteryIdToUpdate],
      queryFn: () => fetchRoasteryForUpdate(roasteryIdToUpdate, axiosPrivate),
      enabled: !!roasteryIdToUpdate,
      gcTime: 0,
      staleTime: 0,
    })

  const updateMutation = useMutation({
    mutationFn: (updatedRoastery) =>
      updateRoastery(updatedRoastery, axiosPrivate),
    onMutate: async (updatedRoastery) => {
      // Cancel any ongoing queries for 'roasteries' to prevent race conditions
      await queryClient.cancelQueries({ queryKey: ['roasteries'] })

      // Snapshot the current roasteries to enable rollback in case of an error
      const previousRoasteries = queryClient.getQueryData(['roasteries'])

      // Optimistically update the cached roasteries list
      queryClient.setQueryData(['roasteries'], (oldData) => {
        const updatedData = oldData.map((roastery) => {
          // If this is the roastery being updated, merge in the new data
          if (roastery._id === updatedRoastery._id) {
            return {
              ...roastery,
              ...updatedRoastery,
              optimistic: true, // Mark this as an optimistic update
              updatedAt: new Date().toISOString(),
            }
          }
          // Leave other roasteries unchanged
          return roastery
        })
        return updatedData
      })

      return { previousRoasteries, updatedRoastery }
    },
    onSuccess: () => {
      notifications.show({
        title: t('notifications.roasterySaveSuccess'),
        color: 'green',
      })
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['roasteries'], context.previousRoasteries)
      notifications.show({
        title: t('notifications.roasterySaveError'),
        color: 'red',
      })
    },
    onSettled: (updatedRoastery, err, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['roasteries'] })
      queryClient.invalidateQueries({
        queryKey: ['roasteries', context.updatedRoastery._id],
      })
      queryClient.invalidateQueries({ queryKey: ['coffees'] })
      queryClient.invalidateQueries({ queryKey: ['brews'] })
      queryClient.invalidateQueries({ queryKey: ['latestBrews'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    },
  })

  // Extract setValues to avoid form object in useEffect deps
  const { setValues } = form

  // Set the details of the roastery to update (In case of an update form)
  useEffect(() => {
    if (roasteryToUpdate && !isFetchingRoasteryToUpdate) {
      setValues({
        name: roasteryToUpdate.name || '',
        country: roasteryToUpdate.country || null,
        rating: roasteryToUpdate.rating || 0,
      })
    }
  }, [roasteryToUpdate, isFetchingRoasteryToUpdate, setValues])

  const handleSaveRoastery = () => {
    form.validate()

    if (form.isValid()) {
      if (roasteryIdToUpdate) {
        updateMutation.mutate({
          ...form.getValues(),
          _id: roasteryToUpdate._id,
        })
      } else {
        createMutation.mutate(form.getValues())
      }
      closeFormModal()
    }
  }

  return (
    <Modal
      title={
        !roasteryIdToUpdate
          ? t('roasteryForm.newRoasteryTitle')
          : t('roasteryForm.editRoasteryTitle')
      }
      opened={opened}
      onClose={closeFormModal}
      onExitTransitionEnd={() => {
        onExited?.()
        form.reset()
      }}
      fullScreen={isMobile}
      size='xl'
      onClick={(event) => event.stopPropagation()}
    >
      <ContentLoader visible={isFetchingRoasteryToUpdate} />
      <Stack mb='lg' align='center'>
        <TextInput
          label={t('roasteryForm.inputs.name.label')}
          placeholder={t('roasteryForm.inputs.name.placeholder')}
          maxLength={50}
          withAsterisk
          key={form.key('name')}
          w='100%'
          {...form.getInputProps('name')}
        />
        <Select
          label={t('roasteryForm.inputs.country.label')}
          placeholder={t('roasteryForm.inputs.country.placeholder')}
          data={countrySelectOptions}
          withAsterisk
          searchable
          w='100%'
          key={form.key('country')}
          {...form.getInputProps('country')}
        />
        <Stack gap={0} align='center'>
          <Rating
            color='brown.5'
            key={form.key('rating')}
            {...form.getInputProps('rating')}
          />
          <Text size='xs' fs='italic' c='dimmed' ta='end' dir='ltr'>
            {form.values.rating !== 0
              ? `${form.values.rating} / 5`
              : t('roasteryForm.callToRate')}
          </Text>
        </Stack>
      </Stack>
      <Group justify='flex-end'>
        <Button
          onClick={handleSaveRoastery}
          disabled={isFetchingRoasteryToUpdate}
        >
          {t('roasteryForm.save')}
        </Button>
      </Group>
    </Modal>
  )
}

export default RoasteryForm
