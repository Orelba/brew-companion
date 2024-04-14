import { Paper, Title, Text } from '@mantine/core'

const CoffeeCard = ({ data }) => {
  const { name, roastery } = data

  return (
    <Paper shadow='md' p='xl'>
      <Title order={3}>{name}</Title>
      <Text fw={500} mt='xs'>
        {roastery.name}
      </Text>
    </Paper>
  )
}

export default CoffeeCard
