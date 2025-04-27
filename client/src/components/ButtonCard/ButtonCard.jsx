import { Paper, Text, Title } from '@mantine/core'
import styles from './button-card.module.scss'

const ButtonCard = ({ h, image, title, text, textLineClamp, onClick }) => {
  return (
    <Paper
      p='lg'
      radius='md'
      h={h || '100%'}
      style={{ backgroundImage: `url(${image})` }}
      className={styles.card}
      onClick={onClick}
    >
      <div>
        {title && (
          <Title
            order={3}
            lh={{ base: 1, xs: 1.2 }}
            fz={{ base: 22, xs: 31 }}
            fw={700}
            mt='xs'
          >
            {title}
          </Title>
        )}
        {text && (
          <Text
            mt={title && 'xs'}
            lineClamp={textLineClamp || 2}
            fw={100}
            lh={{ base: 'sm', xs: 'xl' }}
            fz={{ base: 16, xs: 20 }}
          >
            {text}
          </Text>
        )}
      </div>
    </Paper>
  )
}

export default ButtonCard
