import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { notifications } from '@mantine/notifications'
import { createBrew } from '../../services/brewsService'
import { generateOptimisticBrew } from '../../utils/brewUtils'
import useAxiosPrivate from '../useAxiosPrivate'

const useCreateBrew = ({ coffees, brewingMethods }) => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (newBrew) => createBrew(newBrew, axiosPrivate),
    onMutate: async (newBrew) => {
      await queryClient.cancelQueries({ queryKey: ['brews'] })

      const previousBrews = queryClient.getQueryData(['brews'])

      queryClient.setQueryData(['brews'], (oldData) => {
        const optimisticBrew = generateOptimisticBrew(newBrew, {
          coffees,
          brewingMethods,
        })

        return oldData ? [optimisticBrew, ...oldData] : [optimisticBrew]
      })

      return { previousBrews }
    },
    onSuccess: () => {
      notifications.show({
        title: t('notifications.brewSaveSuccess'),
        color: 'green',
      })
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['brews'], context.previousBrews)
      notifications.show({
        title: t('notifications.brewSaveError'),
        color: 'red',
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['brews'] })
      queryClient.invalidateQueries({ queryKey: ['latestBrews'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    },
  })
}

export default useCreateBrew
