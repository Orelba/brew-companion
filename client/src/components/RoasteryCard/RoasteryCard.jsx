import { Title, Flex, Badge, Rating, Tooltip } from '@mantine/core'
import InventoryCardContainer from '../InventoryCardContainer/InventoryCardContainer'
import ItemDropdown from '../ItemDropdown/ItemDropdown'

const RoasteryCard = ({ data, onMenuEdit, onMenuDelete, menuDisabled }) => {
  const { name, country, rating } = data

  return (
    <InventoryCardContainer>
      <Flex justify='space-between' align='center'>
        <Badge size='sm' variant='light'>
          {country}
        </Badge>
        <ItemDropdown
          onMenuEdit={onMenuEdit}
          onMenuDelete={onMenuDelete}
          disabled={menuDisabled}
        />
      </Flex>
      <Tooltip label={name} openDelay={500} multiline>
        <Title order={5} lineClamp={2}>
          {name}
        </Title>
      </Tooltip>
      {rating !== 0 && (
        <Rating
          value={rating}
          color='brown.5'
          readOnly
          size='xs'
          mt='auto'
          style={{ alignSelf: 'flex-end' }}
        />
      )}
    </InventoryCardContainer>
  )
}

export default RoasteryCard
