import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toggleCoffeeArchiveStatus } from '../../services/coffeesService'
import useAxiosPrivate from '../useAxiosPrivate'
import { useTranslation } from 'react-i18next'
import { notifications } from '@mantine/notifications'

const useToggleArchiveCoffee = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()

  const { t } = useTranslation()

  return useMutation({
    mutationFn: ({ coffeeId, isArchived }) =>
      toggleCoffeeArchiveStatus(coffeeId, isArchived, axiosPrivate),
    onMutate: async ({ coffeeId, isArchived }) => {
      await queryClient.cancelQueries({ queryKey: ['coffees'] })

      const previousCoffees = queryClient.getQueryData(['coffees'])

      queryClient.setQueryData(['coffees'], (oldData) =>
        oldData?.map((oldCoffee) =>
          oldCoffee._id === coffeeId
            ? { ...oldCoffee, archived: isArchived, optimistic: true }
            : oldCoffee
        )
      )

      return { previousCoffees }
    },
    onSuccess: (data, { isArchived }) => {
      notifications.show({
        title: isArchived
          ? t('notifications.coffeeArchiveSuccess')
          : t('notifications.coffeeUnarchiveSuccess'),
        color: 'green',
      })
    },
    onError: (err, { isArchived }, context) => {
      if (context?.previousCoffees) {
        queryClient.setQueryData(['coffees'], context.previousCoffees)
      }
      notifications.show({
        title: isArchived
          ? t('notifications.coffeeArchiveError')
          : t('notifications.coffeeUnarchiveError'),
        color: 'red',
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['coffees'] })
      queryClient.invalidateQueries({ queryKey: ['brews'] })
      queryClient.invalidateQueries({ queryKey: ['latestBrews'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    },
  })
}

export default useToggleArchiveCoffee
