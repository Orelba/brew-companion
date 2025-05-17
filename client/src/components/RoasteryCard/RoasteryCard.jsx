import { Badge, Flex, Rating, Title, Tooltip } from '@mantine/core'
import useCountryOptions from '../../hooks/useCountryOptions'
import InventoryCardContainer from '../InventoryCardContainer/InventoryCardContainer'
import ItemDropdown from '../ItemDropdown/ItemDropdown'

const RoasteryCard = ({ data, onMenuEdit, onMenuDelete, menuDisabled }) => {
  const { name, country, rating } = data

  const { getCountryName } = useCountryOptions()

  return (
    <InventoryCardContainer>
      <Flex justify='space-between' align='center'>
        <Badge size='sm' variant='light'>
          {getCountryName(country)}
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
