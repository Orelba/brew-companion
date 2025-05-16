import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteCoffee } from '../../services/coffeesService'
import useAxiosPrivate from '../useAxiosPrivate'

const useDeleteCoffee = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()

  return useMutation({
    mutationFn: (coffeeToDelete) => deleteCoffee(coffeeToDelete, axiosPrivate),
    // Optimistic update before mutation
    onMutate: async (coffeeToDelete) => {
      // Cancel any outgoing refetches for the 'coffees' query to prevent race conditions
      await queryClient.cancelQueries({ queryKey: ['coffees'] })

      // Snapshot previous data
      const previousCoffees = queryClient.getQueryData(['coffees'])

      // Update UI assuming success
      queryClient.setQueryData(['coffees'], (oldData) =>
        oldData
          ? oldData.filter((coffee) => coffee._id !== coffeeToDelete._id)
          : []
      )

      // Return a context object with the previous value to be used in case of an error
      return { previousCoffees }
    },
    // Rollback changes on error
    onError: (err, variables, context) => {
      queryClient.setQueryData(['coffees'], context.previousCoffees)
    },
    onSettled: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['coffees'] })
      queryClient.invalidateQueries({ queryKey: ['brews'] })
      queryClient.invalidateQueries({ queryKey: ['latestBrews'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    },
  })
}

export default useDeleteCoffee
