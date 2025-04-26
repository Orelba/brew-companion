import { useQuery } from '@tanstack/react-query'
import { fetchStats } from '../../services/statsService'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import StatsGrid from '../../components/StatsGrid/StatsGrid'
import QuickBrewCarousel from '../../components/QuickBrewCarousel/QuickBrewCarousel'

const DashboardPage = () => {
  const axiosPrivate = useAxiosPrivate()

  const {
    data: stats,
    isError: isStatsError,
    isPlaceholderData: isStatsPlaceholderData,
  } = useQuery({
    queryKey: ['stats'],
    queryFn: () => fetchStats(axiosPrivate),
    placeholderData: initialStats,
  })

  return (
    <>
      <QuickBrewCarousel />
      <StatsGrid
        data={stats}
        isLoading={isStatsPlaceholderData}
        isError={isStatsError}
      />
    </>
  )
}

const initialStats = {
  stats: [
    {
      titleId: 'favoriteBrewMethod',
      value: '',
    },
    {
      titleId: 'totalCoffeesTried',
      value: 0,
    },
    {
      titleId: 'totalCoffeeConsumed',
      value: 0,
      formatValue: 'weight',
    },
    {
      titleId: 'totalBrewedThisMonth',
      value: 0,
      diff: 0,
    },
  ],
  favoriteRoasteries: [],
  monthlyBrews: [],
}

export default DashboardPage
