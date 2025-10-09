import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { formatRelativeTime } from '../../utils/formatters'

const RelativeTime = ({ date }) => {
  const { i18n } = useTranslation()
  const [display, setDisplay] = useState(formatRelativeTime(date))

  useEffect(() => {
    // Recalculate every minute
    const interval = setInterval(() => {
      setDisplay(formatRelativeTime(date))
    }, 60000)

    // Update immediately when mounted (e.g., after language switch)
    setDisplay(formatRelativeTime(date))

    return () => clearInterval(interval)
  }, [date, i18n.language])

  return <span>{display}</span>
}

export default RelativeTime
