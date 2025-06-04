export const formatWeight = (grams, t, unitSystem = 'metric') => {
  // Accessing nested translation keys
  const kgLabel = t('weight.kg')
  const gLabel = t('weight.g')
  const lbsLabel = t('weight.lbs')
  const ozLabel = t('weight.oz')

  if (unitSystem === 'imperial') {
    const ounces = grams / 28.3495
    if (ounces >= 16) {
      return `${(ounces / 16).toFixed(2)} ${lbsLabel}`
    }
    return `${ounces.toFixed(2)} ${ozLabel}`
  }

  // Default to metric
  if (grams >= 1000) {
    return `${(grams / 1000).toFixed(2)} ${kgLabel}`
  }
  return `${grams} ${gLabel}`
}

export const getMonthName = (monthNumber, locale) => {
  return new Intl.DateTimeFormat(locale, { month: 'short' }).format(
    new Date(0, monthNumber - 1) // Convert 1-based monthNumber to 0-based month index
  )
}
