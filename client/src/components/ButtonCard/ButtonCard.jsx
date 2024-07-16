import { Paper, Text, Title, rem } from '@mantine/core'
import styles from './button-card.module.scss'

const ButtonCard = ({ image, title, text, textLineClamp, h, onClick }) => {
  return (
    <Paper
      p='lg'
      radius='md'
      h={h || rem(200)}
      style={{ backgroundImage: `url(${image})` }}
      className={styles.card}
      onClick={onClick}
    >
      <div>
        {title && (
          <Title order={3} className={styles.title}>
            {title}
          </Title>
        )}
        {text && (
          <Text
            size='xl'
            mt={title && 'xs'}
            lineClamp={textLineClamp || 2}
            fw={100}
          >
            {text}
          </Text>
        )}
      </div>
    </Paper>
  )
}

export default ButtonCard
