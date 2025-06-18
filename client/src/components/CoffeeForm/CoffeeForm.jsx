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
  createCoffee,
  fetchCoffeeForUpdate,
  updateCoffee,
} from '../../services/coffeesService'

const CoffeeForm = ({
  opened,
  closeFormModal,
  roasteries,
  coffeeIdToUpdate,
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
      roastery: null,
      rating: 0,
    },

    validate: {
      name: (value) => {
        const trimmedValue = value.trim()
        if (trimmedValue.length < 1) return t('coffeeForm.inputs.name.error')
        if (trimmedValue.length > 70) return t('coffeeForm.inputs.name.tooLong')
        return null
      },
      roastery: (value) =>
        !value ? t('coffeeForm.inputs.roastery.error') : null,
    },
  })

  const roasterySelectOptions = roasteries.data?.map((roastery) => ({
    value: roastery._id,
    label: roastery.name,
  }))

  const createMutation = useMutation({
    mutationFn: (newCoffee) => createCoffee(newCoffee, axiosPrivate),
    onMutate: async (newCoffee) => {
      await queryClient.cancelQueries({ queryKey: ['coffees'] })

      const previousCoffees = queryClient.getQueryData(['coffees'])

      queryClient.setQueryData(['coffees'], (old) => [
        {
          _id: `optimistic-${uuidv4()}`,
          optimistic: true,
          ...newCoffee,
          archived: false,
          createdAt: new Date().toISOString(),
          roastery:
            roasteries.data?.find(
              (roastery) => roastery._id === newCoffee.roastery
            ) || null,
        },
        ...(old || []), // Ensure `old` is an array, fallback to an empty array if undefined
      ])

      return { previousCoffees }
    },
    onSuccess: () => {
      notifications.show({
        title: t('notifications.coffeeSaveSuccess'),
        color: 'green',
      })
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['coffees'], context.previousCoffees)
      notifications.show({
        title: t('notifications.coffeeSaveError'),
        color: 'red',
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['coffees'] })
    },
  })

  // Get the details of the coffee to update (In case of an update form)
  const { data: coffeeToUpdate, isFetching: isFetchingCoffeeToUpdate } =
    useQuery({
      queryKey: ['coffees', coffeeIdToUpdate],
      queryFn: () => fetchCoffeeForUpdate(coffeeIdToUpdate, axiosPrivate),
      enabled: !!coffeeIdToUpdate,
      gcTime: 0,
      staleTime: 0,
    })

  const updateMutation = useMutation({
    mutationFn: (updatedCoffee) => updateCoffee(updatedCoffee, axiosPrivate),
    onMutate: async (updatedCoffee) => {
      await queryClient.cancelQueries({ queryKey: ['coffees'] })

      const previousCoffees = queryClient.getQueryData(['coffees'])

      // Optimistically update the coffee list in the cache
      queryClient.setQueryData(['coffees'], (oldData) => {
        if (!oldData) return [updatedCoffee] // If no existing data, insert the updated coffee

        // Find the full roastery details based on the selected roastery ID
        const roastery = roasteries.data?.find(
          (roastery) => roastery._id === updatedCoffee.roastery
        )

        // Construct an optimistic version of the coffee with nested roastery info
        const optimisticCoffee = {
          ...updatedCoffee,
          optimistic: true,
          roastery: {
            _id: updatedCoffee.roastery,
            name: roastery?.name || '',
            country: roastery?.country || '',
          },
        }

        // Replace the matching coffee in the list with the optimistic version
        return oldData.map((coffee) =>
          coffee._id === updatedCoffee?._id
            ? { ...coffee, ...optimisticCoffee }
            : coffee
        )
      })

      // Pass context for potential rollback
      return { previousCoffees, updatedCoffee }
    },
    onSuccess: () => {
      notifications.show({
        title: t('notifications.coffeeSaveSuccess'),
        color: 'green',
      })
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['coffees'], context.previousCoffees)
      notifications.show({
        title: t('notifications.coffeeSaveError'),
        color: 'red',
      })
    },
    onSettled: (updatedCoffee, err, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['coffees'] })
      queryClient.invalidateQueries({
        queryKey: ['coffees', context.updatedCoffee._id],
      })
      queryClient.invalidateQueries({ queryKey: ['brews'] })
      queryClient.invalidateQueries({ queryKey: ['latestBrews'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    },
  })

  // Extract setValues to avoid form object in useEffect deps
  const { setValues } = form

  // Set the details of the coffee to update (In case of an update form)
  useEffect(() => {
    if (coffeeToUpdate && !isFetchingCoffeeToUpdate) {
      setValues({
        name: coffeeToUpdate.name || '',
        roastery: coffeeToUpdate.roastery._id || null,
        rating: coffeeToUpdate.rating || 0,
      })
    }
  }, [coffeeToUpdate, isFetchingCoffeeToUpdate, setValues])

  const handleSaveCoffee = () => {
    form.validate()

    if (form.isValid()) {
      if (coffeeIdToUpdate) {
        updateMutation.mutate({ ...form.getValues(), _id: coffeeToUpdate._id })
      } else {
        createMutation.mutate(form.getValues())
      }
      closeFormModal()
    }
  }

  return (
    <Modal
      title={
        !coffeeIdToUpdate
          ? t('coffeeForm.newCoffeeTitle')
          : t('coffeeForm.editCoffeeTitle')
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
      <ContentLoader visible={isFetchingCoffeeToUpdate} />
      <Stack mb='lg' align='center'>
        <TextInput
          label={t('coffeeForm.inputs.name.label')}
          placeholder={t('coffeeForm.inputs.name.placeholder')}
          maxLength={70}
          withAsterisk
          key={form.key('name')}
          w='100%'
          {...form.getInputProps('name')}
        />
        <Select
          label={t('coffeeForm.inputs.roastery.label')}
          placeholder={t('coffeeForm.inputs.roastery.placeholder')}
          data={roasterySelectOptions}
          withAsterisk
          searchable
          w='100%'
          key={form.key('roastery')}
          {...form.getInputProps('roastery')}
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
              : t('coffeeForm.callToRate')}
          </Text>
        </Stack>
      </Stack>
      <Group justify='flex-end'>
        <Button onClick={handleSaveCoffee} disabled={isFetchingCoffeeToUpdate}>
          {t('coffeeForm.save')}
        </Button>
      </Group>
    </Modal>
  )
}

export default CoffeeForm
