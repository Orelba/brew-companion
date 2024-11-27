import { useState, useContext, useEffect } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router'
import { InventoryContext } from '../contexts/InventoryContext'
import PageTransitionWrapper from '../components/PageTransitionWrapper/PageTransitionWrapper'
import { useTranslation } from 'react-i18next'
import {
  Container,
  SegmentedControl,
  Group,
  Autocomplete,
  Space,
  rem,
} from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'

const InventoryLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [tab, setTab] = useState('coffees')

  const { t } = useTranslation()

  // Use the Inventory Context
  const { coffees, roasteries, searchValue, setSearchValue } =
    useContext(InventoryContext)

  // Create an array of coffee or roastery names for the autocomplete
  const autoCompleteData = (
    tab === 'coffees' ? coffees.data : roasteries.data
  ).map((item) => item.name)

  const handleTabChange = (newTab) => {
    setTab(newTab)
    navigate(newTab)
    setSearchValue('')
  }

  // Update the tab state when the location changes
  useEffect(() => {
    // Set the tab based on the last part of the URL
    setTab(location.pathname.split('/').pop())
  }, [location.pathname])

  return (
    <PageTransitionWrapper>
      <Container
        size='100vw'
        m={{ base: 10, xs: 20, sm: 40, lg: 50, xl: 60 }}
        p={0}
      >
        <Group justify='space-between'>
          <SegmentedControl
            value={tab}
            onChange={handleTabChange}
            color='light-dark(var(--mantine-color-brown-5), var(--mantine-color-dark-5)'
            data={[
              { value: 'coffees', label: t('inventoryLayout.coffees') },
              { value: 'roasteries', label: t('inventoryLayout.roasteries') },
            ]}
          />
          <Group>
            {/* <Button variant='outline'>Filter</Button> */}
            <Autocomplete
              placeholder={t('inventoryLayout.search')}
              value={searchValue}
              onChange={setSearchValue}
              leftSection={
                <IconSearch
                  style={{ width: rem(16), height: rem(16) }}
                  stroke={1.5}
                />
              }
              data={autoCompleteData}
            />
          </Group>
        </Group>
        <Space h='lg' />
        <Outlet />
      </Container>
    </PageTransitionWrapper>
  )
}

export default InventoryLayout
