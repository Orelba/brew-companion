import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { notifications } from '@mantine/notifications'
import { updateBrew } from '../../services/brewsService'
import { generateOptimisticBrew } from '../../utils/brewUtils'
import useAxiosPrivate from '../useAxiosPrivate'

const useUpdateBrew = ({ coffees, brewingMethods }) => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (updatedBrew) => updateBrew(updatedBrew, axiosPrivate),
    onMutate: async (updatedBrew) => {
      await queryClient.cancelQueries({ queryKey: ['brews'] })

      const previousBrew = queryClient.getQueryData(['brews'])

      queryClient.setQueryData(['brews'], (oldData) => {
        const optimisticBrew = generateOptimisticBrew(updatedBrew, {
          coffees,
          brewingMethods,
        })

        const newData = oldData.map((brew) =>
          brew._id === updatedBrew._id ? optimisticBrew : brew
        )

        return oldData ? newData : [optimisticBrew]
      })

      return { previousBrew, updatedBrew }
    },
    onSuccess: () => {
      notifications.show({
        title: t('notifications.brewSaveSuccess'),
        color: 'green',
      })
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ['brews', context.updatedBrew._id],
        context.previousBrew
      )
      notifications.show({
        title: t('notifications.brewSaveError'),
        color: 'red',
      })
    },
    onSettled: (updatedBrew, err, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['brews'] })
      queryClient.invalidateQueries({ queryKey: ['latestBrews'] })
      queryClient.invalidateQueries({
        queryKey: ['brews', context.updatedBrew._id],
      })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    },
  })
}

export default useUpdateBrew
