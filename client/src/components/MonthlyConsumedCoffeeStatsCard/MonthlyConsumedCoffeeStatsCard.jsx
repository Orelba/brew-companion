import { useTranslation } from 'react-i18next'
import { Paper, Text, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { LineChart } from '@mantine/charts'
import { formatWeight, getMonthName } from '../../utils/formatters'
import styles from './monthly-consumed-coffee-stats-card.module.scss'

const MonthlyConsumedCoffeeStatsCard = ({ data }) => {
  const theme = useMantineTheme()
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`)

  const { t, i18n } = useTranslation()

  const isRTL = i18n.dir() === 'rtl'

  const formattedData = data.map((item) => ({
    ...item,
    month: getMonthName(item.month, i18n.language),
  }))

  const title =
    formattedData.length === 1
      ? t('monthlyConsumedCoffeeStatsCard.titleSingleMonth')
      : t('monthlyConsumedCoffeeStatsCard.titleMultipleMonths')

  return (
    <Paper
      withBorder
      p='md'
      radius='md'
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <Text size='xs' c='dimmed' fw={500} tt='uppercase'>
        {title}
      </Text>
      {formattedData.length === 1 ? (
        <Text
          fw={600}
          lh={1}
          fz={{ base: 18, xs: 20, md: 24 }}
          mt={{ base: 10, xs: 15, md: 20, lg: 25 }}
        >
          {formatWeight(formattedData[0].consumption, t)}
        </Text>
      ) : (
        <LineChart
          className={isRTL ? styles.rtl : undefined}
          mih={100}
          data={isRTL ? formattedData : [...formattedData].reverse()}
          dataKey='month'
          series={[
            {
              name: 'consumption',
              color: 'brown',
              label: t('monthlyConsumedCoffeeStatsCard.consumption'),
            },
          ]}
          curveType='monotone'
          withTooltip={!isMobile}
          withPointLabels
          valueFormatter={(value) => formatWeight(value, t)}
          withYAxis={false}
          mt={25}
        />
      )}
    </Paper>
  )
}

export default MonthlyConsumedCoffeeStatsCard
