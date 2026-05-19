import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { formatRelativeTime } from '../../utils/formatters'

const RelativeTime = ({ date }) => {
  const { i18n } = useTranslation()

  const [display, setDisplay] = useState(() => formatRelativeTime(date))

  useEffect(() => {
    // Update the displayed relative time
    const update = () => {
      setDisplay(formatRelativeTime(date))
    }

    // Update immediately when mounted (e.g., after language switch)
    update()

    // Recalculate every minute
    const interval = setInterval(update, 60000)

    return () => clearInterval(interval)
  }, [date, i18n.language])

  return <span>{display}</span>
}

export default RelativeTime
