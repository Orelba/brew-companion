import { Card, Image, Text } from '@mantine/core'
import styles from './card-button.module.scss'
import cx from 'classnames'

const CardButton = ({ title, image, className }) => {
  return (
    <Card shadow="md" padding="xl" className={cx(styles.card, className)}>
      {image && (
        <Card.Section>
          <Image src={image} h={110} alt={title} />
        </Card.Section>
      )}

      <Text fw={500} size="lg" mt="md">
        {title}
      </Text>
    </Card>
  )
}

export default CardButton
