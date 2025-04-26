import Brew from '../models/brew.js'
import Coffee from '../models/coffee.js'
import Roastery from '../models/roastery.js'

const buildStats = ({
  favoriteBrewMethod,
  totalConsumed,
  diff,
  coffeeSet,
  totalBrewedThisMonth,
}) => [
  { titleId: 'favoriteBrewMethod', value: favoriteBrewMethod },
  { titleId: 'totalCoffeesTried', value: coffeeSet.size },
  {
    titleId: 'totalCoffeeConsumed',
    value: totalConsumed,
    formatValue: 'weight',
  },
  { titleId: 'totalBrewedThisMonth', value: totalBrewedThisMonth, diff },
]

const getFavoriteBrewMethod = (brews) => {
  const methodCount = {}
  for (const brew of brews) {
    const method = brew.brewingMethod?.name
    if (method) methodCount[method] = (methodCount[method] || 0) + 1
  }
  return (
    Object.entries(methodCount).reduce(
      (fav, [method, count]) =>
        count > (fav?.count || 0) ? { method, count } : fav,
      null
    )?.method || null
  )
}

const calculateDiff = (thisMonth, lastMonth) =>
  lastMonth?.brews
    ? Math.round(((thisMonth.brews - lastMonth.brews) / lastMonth.brews) * 100)
    : null

const fetchCoffees = async (coffeeIds) => {
  const coffees = await Coffee.find({ _id: { $in: coffeeIds } }).lean()
  return new Map(coffees.map((c) => [c._id.toString(), c]))
}

const aggregateBrews = (brews, coffeeMap) => {
  let totalConsumed = 0
  const monthlyBrews = []
  const coffeeSet = new Set()
  const roasteryMap = {}

  for (const brew of brews) {
    if (brew.dose && !Number.isFinite(brew.dose)) continue

    const dose = Number(brew.dose) || 0
    totalConsumed += dose

    const date = new Date(brew.date)
    const month = date.getMonth()
    const year = date.getFullYear()

    let monthObj = monthlyBrews.find(
      (m) => m.month === month && m.year === year
    )
    if (monthObj) {
      monthObj.consumption += dose
      monthObj.brews += 1
    } else {
      monthlyBrews.push({ month, year, consumption: dose, brews: 1 })
    }

    coffeeSet.add(brew.coffee.toString())

    const coffee = coffeeMap.get(brew.coffee.toString())
    if (coffee?.roastery) {
      roasteryMap[coffee.roastery] = (roasteryMap[coffee.roastery] || 0) + 1
    }
  }

  return { totalConsumed, monthlyBrews, coffeeSet, roasteryMap }
}

const getRecentMonths = (currentMonth, currentYear, earliest, limit = 6) => {
  const months = []
  let month = currentMonth
  let year = currentYear
  while (
    months.length < limit &&
    (year > earliest.year ||
      (year === earliest.year && month >= earliest.month))
  ) {
    months.push({ month, year })
    month--
    if (month < 0) {
      month = 11
      year--
    }
  }
  return months
}

const fillMissingMonths = (monthlyBrews, recentMonths) => {
  const existing = new Set(monthlyBrews.map((m) => `${m.month}-${m.year}`))
  for (const { month, year } of recentMonths) {
    if (!existing.has(`${month}-${year}`)) {
      monthlyBrews.push({ month, year, consumption: 0, brews: 0 })
    }
  }
  return monthlyBrews
}

const getFavoriteRoasteries = async (roasteryMap) => {
  const roasteries = await Promise.all(
    Object.entries(roasteryMap).map(async ([roasteryId, brews]) => {
      const roastery = await Roastery.findById(roasteryId).lean()
      return { roastery: roastery?.name || roasteryId, brews }
    })
  )
  return roasteries.sort((a, b) => b.brews - a.brews).slice(0, 3)
}

const fetchLiveStats = async (userId) => {
  // Fetch all brews and their brewing methods for the user
  const brews = await Brew.find({ userId }).populate('brewingMethod')

  // If no brews exist for the user, return an empty stats object
  if (!brews.length) {
    return { stats: [], favoriteRoasteries: [], monthlyBrews: [], userId }
  }

  // Build a Set of unique coffee IDs to fetch corresponding coffee details
  const coffeeIds = [...new Set(brews.map((b) => b.coffee.toString()))]
  const coffeeMap = await fetchCoffees(coffeeIds)

  // Aggregate brews data and calculate total consumption, monthly brews, and roastery data
  const {
    totalConsumed,
    monthlyBrews: rawMonthlyBrews,
    coffeeSet,
    roasteryMap,
  } = aggregateBrews(brews, coffeeMap)

  // Get current month and year for filtering and displaying relevant data
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  // Find the earliest month of brew data to limit the number of months displayed
  const earliest = rawMonthlyBrews.reduce(
    (acc, cur) =>
      new Date(cur.year, cur.month) < new Date(acc.year, acc.month) ? cur : acc,
    { month: currentMonth, year: currentYear }
  )

  // Get the list of the last 'limit' months, starting from the current month
  const recentMonths = getRecentMonths(currentMonth, currentYear, earliest)

  // Fill in missing months with zero data for consistency in display
  let monthlyBrews = fillMissingMonths(rawMonthlyBrews, recentMonths)

  // Sort the monthly brews by most recent first
  monthlyBrews = monthlyBrews
    .filter((m) =>
      recentMonths.some((r) => r.year === m.year && r.month === m.month)
    )
    .sort((a, b) => b.year * 12 + b.month - (a.year * 12 + a.month))

  // Fetch favorite roasteries and brew method in parallel for efficiency
  const [favoriteRoasteries, favoriteBrewMethod] = await Promise.all([
    getFavoriteRoasteries(roasteryMap),
    getFavoriteBrewMethod(brews),
  ])

  // Get the brews count for the current and previous months
  const thisMonth = monthlyBrews.find(
    (m) => m.year === currentYear && m.month === currentMonth
  )
  const lastMonth = monthlyBrews.find((m) => {
    const prevMonth = (currentMonth - 1 + 12) % 12
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear
    return m.month === prevMonth && m.year === prevYear
  })

  // Calculate the difference in brewed coffees between the current and previous month
  const diff = calculateDiff(thisMonth, lastMonth)

  // Build the final stats object to return, including consumption data and brew method
  const stats = buildStats({
    favoriteBrewMethod,
    totalConsumed,
    diff,
    coffeeSet,
    totalBrewedThisMonth: thisMonth?.brews ?? 0,
  })

  // Return all the calculated stats, favorite roasteries, and monthly brews data
  return { stats, favoriteRoasteries, monthlyBrews, userId }
}

export { fetchLiveStats }
