import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import StatsCard from '../StatsCard/StatsCard'
import RoasteryStatsCard from '../RoasteryStatsCard/RoasteryStatsCard'
import MonthlyConsumedCoffeeStatsCard from '../MonthlyConsumedCoffeeStatsCard/MonthlyConsumedCoffeeStatsCard'
import { Box, Title, Stack, Grid, LoadingOverlay } from '@mantine/core'
import LoaderLogo from '../LoaderLogo/LoaderLogo'
import { notifications } from '@mantine/notifications'

const StatsGrid = ({ data, isLoading, isError }) => {
  const { t } = useTranslation()

  const stats = data.stats.map((stat) => {
    return (
      <Grid.Col span={{ base: 2, xs: 1 }} key={stat.titleId}>
        <StatsCard
          titleId={stat.titleId}
          value={stat.value}
          diff={stat.diff}
          formatValue={stat.formatValue}
        />
      </Grid.Col>
    )
  })

  useEffect(() => {
    if (isError) {
      notifications.show({
        title: t('notifications.statsFetchError'),
        color: 'red',
      })
    }
  }, [isError, t])

  if (isError) return null

  return (
    <Stack
      gap='md'
      h='100%'
      m={{ base: 10, xs: 20, sm: 40, lg: 50, xl: 60 }}
      my={{ base: 10, xs: 0, sm: 0, lg: 0, xl: 0 }}
    >
      <Title
        order={1}
        fz={{ base: 26, xs: 34 }}
        style={{ alignSelf: 'flex-start' }}
      >
        {t('statsGrid.title')}
      </Title>
      <Box pos='relative'>
        <LoadingOverlay
          visible={isLoading}
          loaderProps={{
            children: <LoaderLogo />,
          }}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
        <Grid grow columns={4} gutter={{ base: 'xs', sm: 'sm', md: 'md' }}>
          {stats}
          <Grid.Col span={2}>
            <MonthlyConsumedCoffeeStatsCard data={data.monthlyBrews} />
          </Grid.Col>
          <Grid.Col span={{ base: 4, xs: 2 }}>
            <RoasteryStatsCard data={data.favoriteRoasteries} />
          </Grid.Col>
        </Grid>
      </Box>
    </Stack>
  )
}

export default StatsGrid
