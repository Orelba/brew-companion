import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Group, Stack, Text, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconDroplet, IconDropletFilled } from '@tabler/icons-react'

const ExtractionRating = ({ rating, form }) => {
  const isInput = !!form

  const theme = useMantineTheme()
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`)

  const [hoveredValue, setHoveredValue] = useState(null)

  const { t } = useTranslation()

  const iconColor = 'var(--mantine-color-brown-5)'
  const iconSize = isInput ? '1.3rem' : '1rem'
  const stackGap = isInput ? 0 : isMobile ? 2 : 0

  const { value: currentValue, onChange: handleChange } = isInput
    ? form.getInputProps('rating')
    : { value: rating, onChange: null }

  const getExtractionBalance = (number) => {
    switch (number) {
      case 1:
        return t('extractionRating.underExtracted')
      case 2:
        return t('extractionRating.slightlyUnderExtracted')
      case 3:
        return t('extractionRating.balanced')
      case 4:
        return t('extractionRating.slightlyOverExtracted')
      case 5:
        return t('extractionRating.overExtracted')
      default:
        return t('extractionRating.callToRate')
    }
  }

  return (
    <Stack gap={stackGap} align={isInput ? 'center' : 'flex-end'}>
      <Group
        gap={0}
        wrap='nowrap'
        h={iconSize}
        style={{ alignItems: 'flex-start' }}
        onMouseLeave={
          isInput && !isMobile ? () => setHoveredValue(null) : undefined
        }
      >
        {[1, 2, 3, 4, 5].map((val) => (
          <Box
            key={val}
            style={{
              cursor: isInput ? 'pointer' : undefined,
              padding: isInput ? '4px' : undefined,
              margin: isInput ? '-4px' : undefined,
            }}
            onClick={
              isInput
                ? () => handleChange(val === currentValue ? 0 : val)
                : undefined
            }
            onMouseEnter={
              isInput && !isMobile ? () => setHoveredValue(val) : undefined
            }
            onMouseLeave={
              isInput && !isMobile
                ? (e) => {
                    e.stopPropagation()
                    setHoveredValue(null)
                  }
                : undefined
            }
          >
            {val === (hoveredValue ?? currentValue) ? (
              <IconDropletFilled size={iconSize} color={iconColor} />
            ) : (
              <IconDroplet size={iconSize} color={iconColor} />
            )}
          </Box>
        ))}
      </Group>
      <Text size={isInput ? 'sm' : 'xs'} fs='italic' c='dimmed' ta='end'>
        {getExtractionBalance(currentValue)}
      </Text>
    </Stack>
  )
}

export default ExtractionRating
