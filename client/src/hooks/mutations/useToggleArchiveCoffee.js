import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toggleCoffeeArchiveStatus } from '../../services/coffeesService'
import useAxiosPrivate from '../useAxiosPrivate'

const useToggleArchiveCoffee = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()

  return useMutation({
    mutationFn: ({ coffee, isArchived }) =>
      toggleCoffeeArchiveStatus(coffee, isArchived, axiosPrivate),
    onMutate: async ({ coffee, isArchived }) => {
      await queryClient.cancelQueries({ queryKey: ['coffees'] })

      const previousCoffees = queryClient.getQueryData(['coffees'])

      queryClient.setQueryData(['coffees'], (oldData) =>
        oldData?.map((oldCoffee) =>
          oldCoffee._id === coffee._id
            ? { ...oldCoffee, archived: isArchived }
            : oldCoffee
        )
      )

      return { previousCoffees }
    },
    onError: (err, variables, context) => {
      if (context?.previousCoffees) {
        queryClient.setQueryData(['coffees'], context.previousCoffees)
      }
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
