import { useEffect } from 'react'
import { LoadingOverlay, Stack, Text } from '@mantine/core'
import LoaderLogo from '../LoaderLogo/LoaderLogo'

// Renders a loading overlay that covers the closest parent with relative positioning
const ContentLoader = ({ visible, text, transitionProps }) => {
  // Prevent scrolling when the loader is visible
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden' // Disable scrolling
    } else {
      document.body.style.overflow = '' // Re-enable scrolling
    }

    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = ''
    }
  }, [visible])

  return (
    <LoadingOverlay
      visible={visible}
      zIndex={90}
      loaderProps={{
        children: (
          <Stack align='center' gap='0.3rem'>
            <LoaderLogo />
            {text && <Text fw={500}>{text}</Text>}
          </Stack>
        ),
      }}
      overlayProps={{ radius: 'sm', blur: 2 }}
      transitionProps={transitionProps}
      pos='fixed' // Center the loader
    />
  )
}

export default ContentLoader
