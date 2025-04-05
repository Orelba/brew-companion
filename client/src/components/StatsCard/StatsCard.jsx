import { useTranslation } from 'react-i18next'
import { Paper, Group, Text } from '@mantine/core'
import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconArrowUpLeft,
  IconArrowDownLeft,
} from '@tabler/icons-react'
import { formatWeight } from '../../utils/formatters'
import styles from './stats-card.module.scss'

const StatsCard = ({ titleId, value, diff, formatValue }) => {
  const { t, i18n } = useTranslation()

  const titleKeyMap = {
    favoriteBrewMethod: 'statsCard.favoriteBrewMethod',
    totalCoffeesTried: 'statsCard.totalCoffeesTried',
    totalCoffeeConsumed: 'statsCard.totalCoffeeConsumed',
    totalBrewedThisMonth: 'statsCard.totalBrewedThisMonth',
  }

  const isRTL = i18n.dir() === 'rtl'
  const DiffIcon =
    diff > 0
      ? isRTL
        ? IconArrowUpLeft
        : IconArrowUpRight
      : isRTL
      ? IconArrowDownLeft
      : IconArrowDownRight

  if (formatValue === 'weight') {
    value = formatWeight(value, t)
  }

  return (
    <Paper withBorder p='md' radius='md' h='100%'>
      <Group justify='space-between'>
        <Text size='xs' c='dimmed' tt='uppercase' fw={500}>
          {t(titleKeyMap[titleId] ?? titleId)}
        </Text>
      </Group>

      <Group
        align='flex-end'
        gap='xs'
        mt={{ base: 10, xs: 15, md: 20, lg: 25 }}
      >
        <Text fw={600} lh={1} fz={{ base: 18, xs: 20, md: 24 }}>
          {t(`${value}`, { defaultValue: value })}
        </Text>
        {diff !== undefined && diff !== 0 && (
          <Text
            c={diff > 0 ? 'teal' : 'red'}
            fz='sm'
            fw={500}
            lh={1}
            className={styles.diff}
          >
            <span dir='ltr'>{diff}%</span>
            <DiffIcon size={16} stroke={1.5} />
          </Text>
        )}
      </Group>
      {diff !== undefined && diff !== 0 && (
        <Text fz='xs' c='dimmed' mt={7}>
          {t('statsCard.comparedToPreviousMonth')}
        </Text>
      )}
    </Paper>
  )
}

export default StatsCard
