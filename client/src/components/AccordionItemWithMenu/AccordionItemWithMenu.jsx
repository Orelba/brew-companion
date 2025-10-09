import { Accordion, Divider, Box, Group, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconArrowNarrowRight } from '@tabler/icons-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { deleteBrew } from '../../services/brewsService'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import BrewForm from '../BrewForm/BrewForm'
import ExtractionRating from '../ExtractionRating/ExtractionRating'
import ItemDropdown from '../ItemDropdown/ItemDropdown'
import RelativeTime from '../RelativeTime/RelativeTime'

const AccordionItemWithMenu = ({ item }) => {
  const { t, i18n } = useTranslation()

  // Manage the state of the brew form modal
  const [isBrewFormOpened, { open: openBrewForm, close: closeBrewForm }] =
    useDisclosure()

  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  // Create a mutation to send a new brew to the log
  const deleteMutation = useMutation({
    mutationFn: (brewToDelete) => deleteBrew(brewToDelete, axiosPrivate),
    // Optimistic update before mutation
    onMutate: async (brewToDelete) => {
      // Cancel any outgoing refetches for the 'brews' query to prevent race conditions
      await queryClient.cancelQueries(['brews'])

      // Snapshot previous data
      const previousBrews = queryClient.getQueryData(['brews'])

      // Update UI assuming success
      queryClient.setQueryData(['brews'], (oldData) =>
        oldData ? oldData.filter((brew) => brew._id !== brewToDelete._id) : []
      )

      // Return a context object with the previous value to be used in case of an error
      return { previousBrews }
    },
    // Rollback changes on error
    onError: (err, variables, context) => {
      queryClient.setQueryData(['brews'], context.previousBrews)
    },
    // Invalidate queries to refetch data
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['brews'] })
      queryClient.invalidateQueries({ queryKey: ['latestBrews'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    },
  })

  const handleDeleteBrew = () => {
    deleteMutation.mutate(item)
  }

  const isOptimisticUpdatePlaceholder = item._id === 'optimistic'

  return (
    <Accordion.Item value={item._id}>
      {/* Accordion Control */}
      <Accordion.Control component='div'>
        <Group justify='space-between' wrap='nowrap'>
          <Text component='span' fw={500} truncate>
            {item.coffee.name}
            {item.brewingMethod.name && ` - ${t(item.brewingMethod.name)} `}
          </Text>
          <Group gap='xs' wrap='nowrap'>
            {/* Extraction Rating */}
            {item.rating !== 0 && <ExtractionRating rating={item.rating} />}

            {/* Dropdown Menu */}
            <ItemDropdown
              onMenuEdit={openBrewForm}
              onMenuDelete={handleDeleteBrew}
              disabled={isOptimisticUpdatePlaceholder}
            />
            <BrewForm
              opened={isBrewFormOpened}
              onClose={closeBrewForm}
              brewIdToUpdate={item._id}
            />
          </Group>
        </Group>
      </Accordion.Control>

      {/* Collapsible Panel */}
      <Accordion.Panel>
        {/* Brew Settings Section */}
        <Box c='dimmed' fz='xs' fs='italic'>
          <Group gap='xs' align='center'>
            {t('accordionItemWithMenu.brewSettings')}
            <Divider flex={1} />
            <RelativeTime date={item.date} />
          </Group>
        </Box>
        <Text fw={500}>
          {t('accordionItemWithMenu.grindSetting')}:{' '}
          <Text component='span'>{item.grindSetting}</Text>
        </Text>
        {(item.yield || item.dose) && (
          <Text fw={500}>
            {t('accordionItemWithMenu.doseYield')}:{' '}
            <Text component='span'>
              {item.dose || t('accordionItemWithMenu.unknown')}
              {item.dose &&
                (i18n.dir() === 'rtl' ? ' ' : '') +
                  t('accordionItemWithMenu.gram')}
            </Text>
            <IconArrowNarrowRight
              size='1rem'
              style={{
                verticalAlign: 'middle',
                transform: i18n.dir() === 'rtl' ? 'scaleX(-1)' : undefined,
              }}
            />
            <Text component='span'>
              {item.yield || t('accordionItemWithMenu.unknown')}
              {item.yield &&
                (i18n.dir() === 'rtl' ? ' ' : '') +
                  t('accordionItemWithMenu.gram')}
            </Text>
            <BrewRatio brewDose={item.dose} brewYield={item.yield} />
          </Text>
        )}
        {item.time && (
          <Text fw={500}>
            {t('accordionItemWithMenu.time')}:{' '}
            <Text component='span'>{item.time}</Text>
          </Text>
        )}
        {item.temperature && (
          <Text fw={500}>
            {t('accordionItemWithMenu.temp')}:{' '}
            <Text component='span'>{item.temperature}°C</Text>
          </Text>
        )}

        {/* Notes Section */}
        {item.notes && (
          <>
            <Divider
              label={t('accordionItemWithMenu.notes')}
              fs='italic'
              labelPosition='left'
            />
            <Text>{item.notes}</Text>
          </>
        )}
      </Accordion.Panel>
    </Accordion.Item>
  )
}

const BrewRatio = ({ brewDose, brewYield }) => {
  if (!brewDose || !brewYield) return null

  const brewRatio = brewYield / brewDose
  const formattedBrewRatio = Number.isInteger(brewRatio)
    ? brewRatio.toFixed(0)
    : brewRatio.toFixed(1)

  return ` (1:${formattedBrewRatio})`
}

export default AccordionItemWithMenu
