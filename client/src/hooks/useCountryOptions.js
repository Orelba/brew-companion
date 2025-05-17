import { useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import countries from 'i18n-iso-countries'

import enLocale from 'i18n-iso-countries/langs/en.json'
import heLocale from 'i18n-iso-countries/langs/he.json'

countries.registerLocale(enLocale)
countries.registerLocale(heLocale)

const useCountryOptions = () => {
  const { i18n } = useTranslation()
  const currentLang = i18n.language || 'en'

  const countryNames = useMemo(() => {
    return countries.getNames(currentLang, { select: 'alias' }) || {}
  }, [currentLang])

  const options = useMemo(() => {
    return Object.entries(countryNames)
      .filter(([code]) => !excludeCountryCodes.includes(code))
      .map(([code, name]) => ({
        value: code,
        label: name,
      }))
  }, [countryNames])

  const getCountryName = useCallback(
    (code) => countryNames[code] || code,
    [countryNames]
  )

  return { options, getCountryName }
}

// List of country codes to exclude
const excludeCountryCodes = [
  'AQ', // Antarctica
  'BV', // Bouvet Island
  'HM', // Heard Island and McDonald Islands
  'TF', // French Southern Territories
  'UM', // U.S. Minor Outlying Islands
  'PN', // Pitcairn Islands
  'GS', // South Georgia and the South Sandwich Islands
  'NF', // Norfolk Island
  'IO', // British Indian Ocean Territory
  'SH', // Saint Helena, Ascension and Tristan da Cunha
  'WF', // Wallis and Futuna
  'TK', // Tokelau
  'NU', // Niue

  // UK/US/French territories unlikely to have roasteries
  'AI',
  'BM',
  'VG',
  'KY',
  'MS',
  'TC',
  'FK',
  'PM',
  'MQ',
  'GP',
  'GF',
  'RE',
  'YT',
  'NC',
  'PF',
  'BQ',
  'SX',
  'CW',
  'MP',
  'GU',
  'AS',

  // Politically isolated or unstable regions with little specialty coffee presence
  'KP',
  'SS',
  'EH',
  'PS',
  'SY',
]

export default useCountryOptions
