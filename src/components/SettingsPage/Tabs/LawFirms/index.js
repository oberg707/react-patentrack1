import React from 'react'

import { useSelector } from 'react-redux'
import { addLawFirms, fetchLawFirms } from '../../../../actions/settingsActions'
import Page from '../../components/Page'
import LawFirmForm from './LawFirmForm'
import AddressesTable from './AddressesTable'

const COLUMNS = [
  { id: 'name', label: 'Name' },
  { id: 'createdAt', label: 'Created At' },
  { id: 'updatedAt', label: 'Updated At' },
]

const ID_KEY = 'lawfirm_id'
const TITLE = 'Low Firms'
const NAME = 'low firm'

const ACTIONS = {
  fetchItems: fetchLawFirms,
  updateItem: () => {
  },
  addItem: addLawFirms,
}

const LawFirms = () => {
  const { list, loading } = useSelector(state => state.settings.lawFirms)
  
  return (
    <Page
      loading={loading}
      actions={ACTIONS}
      name={NAME}
      fieldsComponent={LawFirmForm}
      childComponent={AddressesTable}
      idKey={ID_KEY}
      title={TITLE}
      columns={COLUMNS}
      data={list.map((data) => ({ ...data, expandable: true }))}
    />
  )
}

export default LawFirms
