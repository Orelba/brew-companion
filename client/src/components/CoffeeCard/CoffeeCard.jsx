import { Paper, Title, Flex, Badge, Rating, Tooltip } from '@mantine/core'
import ItemDropdown from '../ItemDropdown/ItemDropdown'

const CoffeeCard = ({
  data,
  onMenuEdit,
  onMenuArchive,
  onMenuDelete,
  menuDisabled,
}) => {
  const { name, roastery } = data

  return (
    <Paper
      shadow='md'
      p='lg'
      pos='relative'
      display='flex'
      style={{ flexDirection: 'column', gap: '0.4rem' }}
      bd='1px solid light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-5))'
    >
      <Flex justify='space-between' align='center'>
        <Badge size='sm' variant='light'>
          {roastery.name}
        </Badge>
        <ItemDropdown
          isArchived={data.archived}
          onMenuEdit={onMenuEdit}
          onMenuArchive={onMenuArchive}
          onMenuDelete={onMenuDelete}
          disabled={menuDisabled}
        />
      </Flex>
      <Tooltip label={name} openDelay={500} multiline>
        <Title order={5} lineClamp={2}>
          {name}
        </Title>
      </Tooltip>
      {data.rating !== 0 && (
        <Rating
          value={data.rating}
          color='brown.5'
          readOnly
          size='xs'
          mt='auto'
          style={{ alignSelf: 'flex-end' }}
        />
      )}
    </Paper>
  )
}

export default CoffeeCard
