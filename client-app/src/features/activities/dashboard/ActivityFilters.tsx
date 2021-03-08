import React from 'react'
import Calendar from 'react-calendar'
import { Header, Menu } from 'semantic-ui-react'

function ActivityFilters() {
  return (
    <>
      <Menu vertical size='large' style={{ width: '100%', marginTop: 26 }}>
        <Header icon='filter' attached color='teal' content='Filters' />
        <Menu.Item content='All activities' />
        <Menu.Item content="I'm Going" />
        <Menu.Item content="I'm hosting " />
      </Menu>
      <Header />
      <Calendar />
    </>
  )
}

export default ActivityFilters
