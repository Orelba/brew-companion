import { useTranslation } from 'react-i18next'
import { Rating, Stack, Text } from '@mantine/core'
import { IconDroplet, IconDropletFilled } from '@tabler/icons-react'

const ExtractionRating = ({ rating, form }) => {
  // the component acts as a controlled input if a form object is provided.
  const isInput = !!form

  const { t } = useTranslation()

  const iconColor = 'var(--mantine-color-brown-5)'
  const iconSize = isInput ? '1.3rem' : '1rem'

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
    <Stack gap={0} align={isInput ? 'center' : 'flex-end'}>
      <Rating
        h={iconSize}
        value={rating}
        emptySymbol={<IconDroplet size={iconSize} color={iconColor} />}
        fullSymbol={<IconDropletFilled size={iconSize} color={iconColor} />}
        highlightSelectedOnly
        readOnly={!isInput}
        key={isInput && form.key('rating')}
        {...(isInput ? form.getInputProps('rating') : {})}
      />
      <Text size={isInput ? 'sm' : 'xs'} fs='italic' c='dimmed' ta='end'>
        {getExtractionBalance(rating)}
      </Text>
    </Stack>
  )
}

export default ExtractionRating
