import { ActionIcon, Menu, rem } from '@mantine/core'
import {
  IconArchive,
  IconDots,
  IconPencil,
  IconTrash,
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

const ItemDropdown = ({
  isArchived,
  onMenuEdit,
  onMenuArchive,
  onMenuDelete,
  disabled,
}) => {
  const { t } = useTranslation()

  return (
    <Menu
      transitionProps={{ transition: 'pop' }}
      withArrow
      position='bottom-end'
      disabled={disabled}
    >
      <Menu.Target disabled={disabled}>
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
          {t('itemDropdown.edit')}
        </Menu.Item>
        {typeof isArchived === 'boolean' && (
          <Menu.Item
            onClick={onMenuArchive}
            leftSection={
              <IconArchive
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }
            color='yellow'
          >
            {isArchived
              ? t('itemDropdown.unarchive')
              : t('itemDropdown.archive')}
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
          {t('itemDropdown.delete')}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}

export default ItemDropdown
