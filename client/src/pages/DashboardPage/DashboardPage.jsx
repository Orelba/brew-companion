import StatsGrid from '../../components/StatsGrid/StatsGrid'
import QuickBrewCarousel from '../../components/QuickBrewCarousel/QuickBrewCarousel'

// TODO: DELETE: This is a temporary data structure to test the stats grid and roastery chart
const statsData = {
  stats: [
    { titleId: 'favoriteBrewMethod', value: 'brewingMethods.pourOver' },
    { titleId: 'totalCoffeesTried', value: 10 },
    { titleId: 'totalCoffeeConsumed', value: 1054, formatValue: 'weight' },
    { titleId: 'totalBrewedThisMonth', value: '23', diff: -2 },
  ],
  favoriteRoasteries: [
    { roastery: 'Tsuk Cafe', brews: 78 },
    { roastery: 'Jera', brews: 62 },
    { roastery: 'Negro', brews: 34 },
  ],
  monthlyBrews: [
    { month: 11, consumption: 820 },
    { month: 12, consumption: 812 },
    { month: 1, consumption: 232 },
    { month: 2, consumption: 405 },
    { month: 3, consumption: 182 },
    { month: 4, consumption: 723 },
  ],
  sufficientData: true,
}

const DashboardPage = () => {
  return (
    <>
      <QuickBrewCarousel />
      <StatsGrid data={statsData} />
    </>
  )
}

export default DashboardPage
