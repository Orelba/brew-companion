import { useQuery } from '@tanstack/react-query'
import { fetchRecentBrews } from '../../services/brewsService'
import { fetchStats } from '../../services/statsService'
import { usePageTitle } from '../../hooks/usePageTitle'
import useLoadingScreen from '../../hooks/useLoadingScreen'
import PageTransitionWrapper from '../../components/PageTransitionWrapper/PageTransitionWrapper'
import useInventoryStatus from '../../hooks/useInventoryStatus'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import GettingStarted from '../../components/GettingStarted/GettingStarted'
import QuickBrewCarousel from '../../components/QuickBrewCarousel/QuickBrewCarousel'
import StatsGrid from '../../components/StatsGrid/StatsGrid'

const DashboardPage = () => {
  usePageTitle('') // Set the page title

  const axiosPrivate = useAxiosPrivate()

  const {
    isInventoryReady,
    hasBrews,
    hasCoffees,
    hasRoasteries,
    isInventoryComplete,
  } = useInventoryStatus()

  const {
    data: recentBrews,
    isError: isRecentBrewsError,
    isPlaceholderData: isRecentBrewsPlaceholderData,
  } = useQuery({
    queryKey: ['latestBrews'],
    queryFn: () => fetchRecentBrews(axiosPrivate),
    placeholderData: [], // Default data to an empty array
  })

  const {
    data: stats,
    isError: isStatsError,
    isPlaceholderData: isStatsPlaceholderData,
  } = useQuery({
    queryKey: ['stats'],
    queryFn: () => fetchStats(axiosPrivate),
    placeholderData: initialStats,
  })

  useLoadingScreen(!isInventoryReady)

  if (!isInventoryReady) {
    return null
  }

  return (
    <PageTransitionWrapper>
      {!isInventoryComplete ? (
        <GettingStarted
          hasRoasteries={hasRoasteries}
          hasCoffees={hasCoffees}
          hasBrews={hasBrews}
        />
      ) : (
        <>
          <QuickBrewCarousel
            data={recentBrews}
            isLoading={isRecentBrewsPlaceholderData}
            isError={isRecentBrewsError}
          />
          <StatsGrid
            data={stats}
            isLoading={isStatsPlaceholderData}
            isError={isStatsError}
          />
        </>
      )}
    </PageTransitionWrapper>
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
