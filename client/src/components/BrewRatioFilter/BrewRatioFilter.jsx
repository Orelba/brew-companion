import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RangeSlider, Text, Group, Stack, NumberInput } from '@mantine/core'
import DirectionAwareIndicator from '../DirectionAwareIndicator/DirectionAwareIndicator'
import { formatRatio } from '../../utils/formatters'

const calcRatio = (dose, brewYield) => brewYield / dose

const BrewRatioFilter = ({ brews, value, onChange }) => {
  const { t } = useTranslation()

  const { min, max } = useMemo(() => {
    const ratios = brews
      .filter((b) => b.dose && b.yield)
      .map((b) => calcRatio(b.dose, b.yield))

    if (!ratios.length) return { min: 1, max: 20 }

    return {
      min: Math.floor(Math.min(...ratios) * 10) / 10,
      max: Math.ceil(Math.max(...ratios) * 10) / 10,
    }
  }, [brews])

  const current = value ?? [min, max]
  const [localRange, setLocalRange] = useState(current)

  if (min === max)
    return (
      <Stack gap='xs' px='sm' py='xs' style={{ width: 'min(280px, 90vw)' }}>
        <Text size='sm' c='dimmed'>
          {t('brewRatioFilter.ratio')}
        </Text>
        <RangeSlider
          min={min}
          max={min + 1}
          step={0.1}
          minRange={0}
          value={[min, min + 1]}
          disabled
        />
        <Text size='xs' c='dimmed' fs='italic'>
          {t('brewRatioFilter.allSameRatio')} (1:{formatRatio(min)})
        </Text>
      </Stack>
    )

  return (
    <Stack gap='xs' px='sm' py='xs' style={{ width: 'min(280px, 90vw)' }}>
      <DirectionAwareIndicator disabled={!value} size={6} position='middle-end'>
        <Text size='sm' c='dimmed'>
          {t('brewRatioFilter.ratio')}
        </Text>
      </DirectionAwareIndicator>
      <RangeSlider
        min={min}
        max={max}
        step={0.1}
        minRange={0}
        value={localRange}
        onChange={setLocalRange}
        onChangeEnd={(val) => {
          const isFullRange = val[0] === min && val[1] === max
          onChange(isFullRange ? null : val)
        }}
        label={(val) => `1:${formatRatio(val)}`}
        mb='xs'
        styles={{ thumb: { zIndex: 300 } }} // Ensure the thumb label is above the indicator
      />
      <Group grow>
        <NumberInput
          size='xs'
          prefix='1:'
          value={localRange[0]}
          min={min}
          max={localRange[1] - 0.1}
          step={0.1}
          decimalScale={1}
          onChange={(val) => {
            if (!val) return
            const rounded = Math.round(val * 10) / 10
            const next = [rounded, localRange[1]]
            setLocalRange(next)
            onChange(next)
          }}
        />
        <NumberInput
          size='xs'
          prefix='1:'
          value={localRange[1]}
          min={localRange[0] + 0.1}
          max={max}
          step={0.1}
          decimalScale={1}
          onChange={(val) => {
            if (!val) return
            const rounded = Math.round(val * 10) / 10
            const next = [localRange[0], rounded]
            setLocalRange(next)
            onChange(next)
          }}
        />
      </Group>
    </Stack>
  )
}

export default BrewRatioFilter
