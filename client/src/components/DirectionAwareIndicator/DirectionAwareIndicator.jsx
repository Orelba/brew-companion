import { Indicator } from '@mantine/core'
import { useDirection } from '@mantine/core'

const DirectionAwareIndicator = ({
  position = 'top-end',
  children,
  ...props
}) => {
  const { dir } = useDirection()

  const getPosition = () => {
    const [vertical, horizontal] = position.split('-')
    if (!horizontal) return position
    const flippedHorizontal =
      dir === 'rtl' ? (horizontal === 'start' ? 'end' : 'start') : horizontal
    return `${vertical}-${flippedHorizontal}`
  }

  return (
    <Indicator position={getPosition()} {...props}>
      {children}
    </Indicator>
  )
}

export default DirectionAwareIndicator
