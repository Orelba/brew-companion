import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteRoastery } from '../../services/roasteriesService'
import useAxiosPrivate from '../useAxiosPrivate'
import { useTranslation } from 'react-i18next'
import { notifications } from '@mantine/notifications'

const useDeleteRoastery = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()

  const { t } = useTranslation()

  return useMutation({
    mutationFn: (roasteryIdToDelete) =>
      deleteRoastery(roasteryIdToDelete, axiosPrivate),
    // Optimistic update before mutation
    onMutate: async (roasteryIdToDelete) => {
      // Cancel any outgoing refetches for the 'roasteries' query to prevent race conditions
      await queryClient.cancelQueries({ queryKey: ['roasteries'] })

      // Snapshot previous data
      const previousRoasteries = queryClient.getQueryData(['roasteries'])

      // Update UI assuming success
      queryClient.setQueryData(['roasteries'], (oldData) =>
        oldData
          ? oldData.filter((roastery) => roastery._id !== roasteryIdToDelete)
          : []
      )

      // Return a context object with the previous value to be used in case of an error
      return { previousRoasteries }
    },
    onSuccess: () => {
      notifications.show({
        title: t('notifications.roasteryDeleteSuccess'),
        color: 'green',
      })
    },
    // Rollback changes on error
    onError: (err, variables, context) => {
      queryClient.setQueryData(['roasteries'], context.previousRoasteries)
      notifications.show({
        title: t('notifications.roasteryDeleteError'),
        color: 'red',
      })
    },
    onSettled: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['roasteries'] })
      queryClient.invalidateQueries({ queryKey: ['coffees'] })
      queryClient.invalidateQueries({ queryKey: ['brews'] })
      queryClient.invalidateQueries({ queryKey: ['latestBrews'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    },
  })
}

export default useDeleteRoastery
