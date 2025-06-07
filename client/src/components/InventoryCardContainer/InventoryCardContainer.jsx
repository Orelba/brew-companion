import { Card } from '@mantine/core'

const InventoryCardContainer = ({ children }) => {
  return (
    <Card
      shadow='md'
      p='lg'
      style={{ flexDirection: 'column', gap: '0.4rem' }}
      bd='1px solid light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-5))'
    >
      {children}
    </Card>
  )
}

export default InventoryCardContainer
