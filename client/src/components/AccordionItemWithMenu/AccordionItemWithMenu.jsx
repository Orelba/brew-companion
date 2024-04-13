import { useTranslation } from 'react-i18next'
import {
  Accordion,
  ActionIcon,
  Divider,
  Group,
  Menu,
  Rating,
  rem,
  Stack,
  Text,
} from '@mantine/core'
import {
  IconArrowNarrowRight,
  IconDroplet,
  IconDropletFilled,
  IconPencil,
  IconArchive,
  IconTrash,
  IconDots,
} from '@tabler/icons-react'

// TODO: roasteries that dont have notes can open. should they not?
// TODO: find a way to format the time, it's currently in seconds
const AccordionItemWithMenu = ({
  variant = 'inventory',
  item,
  onMenuEdit,
  onMenuDelete,
}) => {
  const { t, i18n } = useTranslation()

  const isVariantBrew = variant === 'brew'
  const isVariantCoffee = variant === 'coffee'
  const isVariantRoastery = variant === 'roastery'

  return (
    <Accordion.Item value={item._id}>
      {/* Accordion Control */}
      <Accordion.Control component='div'>
        <Group justify='space-between' wrap='nowrap'>
          <Text component='span' fw={500} truncate>
            {item.name || item.coffee.name}
            {isVariantBrew && ` - ${t(item.method.name)} `}
            {isVariantCoffee && ` (${item.roastery.name})`}
          </Text>
          <Group gap='xs' wrap='nowrap'>
            {/* Extraction Rating */}
            {isVariantBrew && <ExtractionRating rating={item.rating} />}

            {/* Dropdown Menu */}
            <ItemDropdown
              isVariantCoffee={isVariantCoffee}
              onMenuEdit={onMenuEdit}
              onMenuDelete={onMenuDelete}
            />
          </Group>
        </Group>
      </Accordion.Control>

      {/* Collapsible Panel */}
      <Accordion.Panel>
        {/* Brew Settings Section */}
        {isVariantBrew && (
          <>
            <Divider
              label={t('accordionItemWithMenu.brewSettings')}
              fs='italic'
              labelPosition='left'
            />
            <Text fw={500}>
              {t('accordionItemWithMenu.grindSetting')}:{' '}
              <Text component='span'>{item.grind_setting}</Text>
            </Text>
            {(item.yield || item.dose) && (
              <Text fw={500}>
                {t('accordionItemWithMenu.doseYield')}:{' '}
                <Text component='span'>
                  {item.dose || 'Unknown'}
                  {item.dose && 'g'}
                </Text>
                <IconArrowNarrowRight
                  size='1rem'
                  style={{
                    verticalAlign: 'middle',
                    transform: i18n.dir() === 'rtl' ? 'scaleX(-1)' : undefined,
                  }}
                />
                <Text component='span'>
                  {item.yield || 'Unknown'}
                  {item.yield && 'g'}
                </Text>
                <BrewRatio brewDose={item.dose} brewYield={item.yield} />
              </Text>
            )}
            {item.time && (
              <Text fw={500}>
                {t('accordionItemWithMenu.time')}:{' '}
                <Text component='span'>{item.time}s</Text>
              </Text>
            )}
            {item.temperature && (
              <Text fw={500}>
                {t('accordionItemWithMenu.temp')}:{' '}
                <Text component='span'>{item.temperature}°C</Text>
              </Text>
            )}
          </>
        )}

        {/* Notes Section */}
        {item.notes && (
          <>
            <Divider
              label={t('accordionItemWithMenu.notes')}
              fs='italic'
              labelPosition='left'
            />
            <Text>{item.notes}</Text>
          </>
        )}
      </Accordion.Panel>
    </Accordion.Item>
  )
}

const ExtractionRating = ({ rating }) => {
  const { t } = useTranslation()

  const iconColor = 'var(--mantine-color-brown-5)'
  const iconSize = '1rem'

  const getExtractionBalance = (number) => {
    switch (number) {
      case 1:
        return t('accordionItemWithMenu.underExtracted')
      case 2:
        return t('accordionItemWithMenu.slightlyUnderExtracted')
      case 3:
        return t('accordionItemWithMenu.balanced')
      case 4:
        return t('accordionItemWithMenu.slightlyOverExtracted')
      case 5:
        return t('accordionItemWithMenu.overExtracted')
      default:
        return t('accordionItemWithMenu.extractionUnknown')
    }
  }

  return (
    <Stack gap={0} align='flex-end'>
      <Rating
        h={iconSize}
        value={rating}
        emptySymbol={<IconDroplet size={iconSize} color={iconColor} />}
        fullSymbol={<IconDropletFilled size={iconSize} color={iconColor} />}
        highlightSelectedOnly
        readOnly
      />
      <Text size='xs' fs='italic' c='dimmed' ta='end'>
        {getExtractionBalance(rating)}
      </Text>
    </Stack>
  )
}

const BrewRatio = ({ brewDose, brewYield }) => {
  if (!brewDose || !brewYield) return null

  const brewRatio = brewYield / brewDose
  const formattedBrewRatio = Number.isInteger(brewRatio)
    ? brewRatio.toFixed(0)
    : brewRatio.toFixed(1)

  return ` (1:${formattedBrewRatio})`
}

const ItemDropdown = ({
  isVariantCoffee,
  onMenuEdit,
  onMenuArchive,
  onMenuDelete,
}) => {
  const { t } = useTranslation()

  return (
    <Menu
      transitionProps={{ transition: 'pop' }}
      withArrow
      position='bottom-end'
    >
      <Menu.Target>
        <ActionIcon
          variant='subtle'
          color='gray'
          onClick={(event) => event.stopPropagation()}
        >
          <IconDots style={{ width: rem(16), height: rem(16) }} stroke='1.5' />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown onClick={(event) => event.stopPropagation()}>
        <Menu.Item
          onClick={onMenuEdit}
          leftSection={
            <IconPencil
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          }
        >
          {t('accordionItemWithMenu.edit')}
        </Menu.Item>
        {isVariantCoffee && (
          <Menu.Item
            onClick={onMenuArchive}
            leftSection={
              <IconArchive
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }
          >
            {t('accordionItemWithMenu.archive')}
          </Menu.Item>
        )}
        <Menu.Item
          onClick={onMenuDelete}
          leftSection={
            <IconTrash
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          }
          color='red'
        >
          {t('accordionItemWithMenu.delete')}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}

export default AccordionItemWithMenu
