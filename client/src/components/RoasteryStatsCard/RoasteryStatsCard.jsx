import { useTranslation } from 'react-i18next'
import { Paper, Text } from '@mantine/core'
import { BarChart } from '@mantine/charts'
import styles from './roastery-stats-card.module.scss'

const RoasteryStatsCard = ({ data }) => {
  const { t, i18n } = useTranslation()

  const isRTL = i18n.dir() === 'rtl'

  const title =
    data.length === 1
      ? t('roasteryStatsCard.titleSingleRoastery')
      : t('roasteryStatsCard.titleMultipleRoasteries')

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
      {data.length === 1 ? (
        <Text
          fw={600}
          lh={1}
          fz={{ base: 18, xs: 20, md: 24 }}
          mt={{ base: 10, xs: 15, md: 20, lg: 25 }}
        >
          {data[0].roastery}
        </Text>
      ) : (
        <BarChart
          className={isRTL ? styles.rtl : undefined}
          mih={100}
          data={isRTL ? [...data].reverse() : data}
          dataKey='roastery'
          series={[{ name: 'brews', color: 'brown' }]}
          style={{ flexGrow: 1 }}
          withYAxis={false}
          withTooltip={false}
          withBarValueLabel
          valueLabelProps={{
            formatter: (value) => `${value} ${t('roasteryStatsCard.cups')}`,
          }}
          mt={25}
        />
      )}
    </Paper>
  )
}

export default RoasteryStatsCard
