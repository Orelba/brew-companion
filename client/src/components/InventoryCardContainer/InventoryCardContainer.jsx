import { Paper } from '@mantine/core'

const InventoryCardContainer = ({ children }) => {
  return (
    <Paper
      shadow='md'
      p='lg'
      pos='relative'
      display='flex'
      style={{ flexDirection: 'column', gap: '0.4rem' }}
      bd='1px solid light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-5))'
    >
      {children}
    </Paper>
  )
}

export default InventoryCardContainer
