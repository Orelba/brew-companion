import { Paper, Title, Flex, Badge } from '@mantine/core'
import ItemDropdown from '../ItemDropdown/ItemDropdown'

const CoffeeCard = ({ data }) => {
  const { name, roastery } = data

  return (
    <Paper shadow='md' p='lg'>
      <Flex mb='xs' justify='space-between' align='center'>
        <Badge size='sm' variant='light'>{roastery.name}</Badge>
        {/* Dropdown Menu */}
        <ItemDropdown
          withArchiveButton
          // onMenuEdit={openBrewForm}
          // onMenuArchive={something}
          // onMenuDelete={handleDeleteBrew}
          // disabled={isOptimisticUpdatePlaceholder}
        />
      </Flex>
      <Title order={5}>{name}</Title>
    </Paper>
  )
}

export default CoffeeCard
