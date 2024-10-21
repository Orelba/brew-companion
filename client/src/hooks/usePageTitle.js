import { useEffect } from 'react'
import { APP_NAME } from '../constants'

const usePageTitle = (title) => {
  useEffect(() => {
    if (title === '') {
      document.title = APP_NAME
    } else {
      document.title = `${title} | ${APP_NAME}`
    }
  }, [title])
}

export { usePageTitle }
