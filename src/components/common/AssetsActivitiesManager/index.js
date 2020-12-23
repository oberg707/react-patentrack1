import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'
import AssetsErrorsTable from './AssetsErrorsTable'
import AssetsRecordsTable from './AssetsRecordsTable'
import AssetsCompletedActivitiesTable from './AssetsCompletedActivitiesTable'

import PatenTrackApi from '../../../api/patenTrack2'

import { convertAssetTypeToTabId } from '../../../utils/assetTypes'
import { numberWithCommas } from '../../../utils/numbers'

import useStyles from './styles'
import Actions from './Actions'

const AssetsActivitiesManager = ({ data }) => {
  const classes = useStyles()

  const isLoading = useSelector(state => state.patenTrack2.companyListLoading)
  const selectedAssetsTypes = useSelector(state => state.patenTrack2.selectedAssetsTypes)
  const selectedCompaniesList = useSelector(state => state.patenTrack2.selectedCompaniesList)
  const selectedAssetsCustomers = useSelector(state => state.patenTrack2.selectedAssetsCustomers)
  const selectedAssetsTransactions = useSelector(state => state.patenTrack2.selectedAssetsTransactions)
  const selectedAssetsPatents = useSelector(state => state.patenTrack2.selectedAssetsPatents)
  

  /* const lastErrorsCountTime = 0//useSelector(state => state.assets.errors.countTime)
  const lastRecordsCountTime = 0//useSelector(state => state.assets.records.countTime)
  const lastCompletedCountTime = 0//useSelector(state => state.assets.completed.countTime) */

  const lastErrorsCountTime = useSelector(state => state.assets.errors.countTime)
  const lastRecordsCountTime = useSelector(state => state.assets.records.countTime)
  const lastCompletedCountTime = useSelector(state => state.assets.completed.countTime)

  const [ selectedTab, setSelectedTab ] = React.useState(0)

  const [ assetsErrorsDataCount, setAssetsErrorsDataCount ] = useState(0)
  const [ isLoadingAssetsErrorsDataCount, setIsLoadingAssetsErrorsDataCount ] = useState(false)

  const [ assetsRecordsDataCount, setAssetsRecordsDataCount ] = useState(0)
  const [ isLoadingAssetsRecordsDataCount, setIsLoadingAssetsRecordsDataCount ] = useState(false)

  const [ assetsCompletedActivitiesDataCount, setAssetsCompletedActivitiesDataCount ] = useState(0)
  const [ isLoadingAssetsCompletedActivitiesDataCount, setIsLoadingAssetsCompletedActivitiesDataCount ] = useState(false)

  const handleChangeTab = (event, newTab) => setSelectedTab(newTab)

  const paramsUrl = useMemo(() => {
    const tabIds = selectedAssetsTypes.map(assetsType =>
      convertAssetTypeToTabId(assetsType),
    )
    return [
      selectedAssetsTypes.length && `tabs=[${encodeURI(tabIds)}]`,
      selectedCompaniesList.length && `companies=[${encodeURI(selectedCompaniesList.map(company => company.id))}]`,
      selectedAssetsCustomers.length && `customers=[${encodeURI(selectedAssetsCustomers)}]`,
      selectedAssetsTransactions.length && `transactions=[${encodeURI(selectedAssetsTransactions)}]`,
      selectedAssetsPatents.length && `patents=[${encodeURI(selectedAssetsPatents)}]`,
      'count=true',
    ].filter(Boolean).join('&')
  }, [ selectedCompaniesList, selectedAssetsCustomers, selectedAssetsPatents, selectedAssetsTransactions, selectedAssetsTypes ])

  useEffect(() => {
    if (selectedCompaniesList.length === 0 || selectedAssetsTypes.length === 0) return setAssetsErrorsDataCount(0)
    const getAssetsErrorsDataCountFunction = async () => {
      setIsLoadingAssetsErrorsDataCount(true)
      const { data } = await PatenTrackApi.getAssetsErrorsData(paramsUrl)
      setAssetsErrorsDataCount(data)
      setIsLoadingAssetsErrorsDataCount(false)
    }
    getAssetsErrorsDataCountFunction()
  }, [ lastErrorsCountTime, paramsUrl, selectedAssetsTypes, selectedCompaniesList ])

  // useEffect(() => {
  //   if (selectedCompaniesList.length === 0 || selectedAssetsTypes.length === 0) return setAssetsFixesDataCount(0)
  //   const getAssetsFixesDataCountFunction = async () => {
  //     setIsLoadingAssetsFixesDataCount(true)
  //     const { data } = await PatenTrackApi.getAssetsActivitiesData('fix', { count: true })
  //     setAssetsFixesDataCount(data[0].count_items)
  //     setIsLoadingAssetsFixesDataCount(false)
  //   }
  //   getAssetsFixesDataCountFunction()
  // }, [ lastFixesCountTime, selectedAssetsTypes, selectedCompaniesList ])

  useEffect(() => {
    if (selectedCompaniesList.length === 0 || selectedAssetsTypes.length === 0) return setAssetsRecordsDataCount(0)
    const getAssetsRecordsDataCountFunction = async () => {
      setIsLoadingAssetsRecordsDataCount(true)
      const { data } = await PatenTrackApi.getAssetsActivitiesData('record', { count: true })
      setAssetsRecordsDataCount(data[0].count_items)
      setIsLoadingAssetsRecordsDataCount(false)
    }
    getAssetsRecordsDataCountFunction()
  }, [ lastRecordsCountTime, selectedAssetsTypes, selectedCompaniesList ])

  useEffect(() => {
    if (selectedCompaniesList.length === 0 || selectedAssetsTypes.length === 0) return setAssetsCompletedActivitiesDataCount(0)
    const getAssetsCompletedActivitiesDataCountFunction = async () => {
      setIsLoadingAssetsCompletedActivitiesDataCount(true)
      const { data } = await PatenTrackApi.getAssetsActivitiesData('complete', { count: true })
      setAssetsCompletedActivitiesDataCount(data[0].count_items)
      setIsLoadingAssetsCompletedActivitiesDataCount(false)
    }
    getAssetsCompletedActivitiesDataCountFunction()
  }, [ lastCompletedCountTime, selectedAssetsTypes, selectedCompaniesList ])

  return isLoading ? null : (
    <Paper className={classes.root} square>
      <div className={classes.toolbar}>
        <div className={classes.toolbarActions}>
          <Actions selectedTab={selectedTab} />
        </div>
        <Tabs className={classes.tabs} variant={'scrollable'} value={selectedTab} onChange={handleChangeTab}>
          <Tab
            className={classes.tab}
            label={
              <TabLabel
                label={'Errors'}
                isLoading={isLoadingAssetsErrorsDataCount}
                count={assetsErrorsDataCount}
              />
            }
          />

          <Tab
            className={classes.tab}
            label={
              <TabLabel
                label={'In Process'}
                isLoading={isLoadingAssetsRecordsDataCount}
                count={assetsRecordsDataCount}
              />
            }
          />
          <Tab
            className={classes.tab}
            label={
              <TabLabel
                label={'Completed'}
                isLoading={isLoadingAssetsCompletedActivitiesDataCount}
                count={assetsCompletedActivitiesDataCount}
              />
            }
          />
        </Tabs>
      </div>
      
      {selectedTab === 0 && <AssetsErrorsTable />}
      {selectedTab === 1 && <AssetsRecordsTable />}
      {selectedTab === 2 && <AssetsCompletedActivitiesTable />}
      
    </Paper>
  )
}

const TabLabel = ({ label, isLoading, count }) => {
  const classes = useStyles()

  return (
    <div>
      <span className={classes.tabLabel}>{label}</span>
      {isLoading ? (
        <CircularProgress size={12} color="secondary" />
      ) : (
        <span>({numberWithCommas(count)})</span>
      )}
    </div>
  )
}

export default AssetsActivitiesManager