import { LoadingOverlay } from '@mantine/core'
import LoaderLogo from '../LoaderLogo/LoaderLogo'

// Renders a loading overlay that covers the closest parent with relative positioning
const ContentLoader = ({ visible, transitionProps }) => {
  return (
    <LoadingOverlay
      visible={visible}
      zIndex={90}
      loaderProps={{ children: <LoaderLogo /> }}
      overlayProps={{ radius: 'sm', blur: 2 }}
      transitionProps={transitionProps}
    />
  )
}

export default ContentLoader
