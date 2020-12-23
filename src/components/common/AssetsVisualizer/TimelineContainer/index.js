import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import moment from 'moment'
import _debounce from 'lodash/debounce'
import { useDispatch, useSelector } from 'react-redux'
import { DataSet } from 'vis-data/esnext'
import { Timeline } from 'vis-timeline/esnext'
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'

import 'vis-timeline/styles/vis-timeline-graph2d.min.css'

import PatenTrackApi from '../../../../api/patenTrack2'
import { convertAssetTypeToTabId, convertTabIdToAssetType } from '../../../../utils/assetTypes'

import IllustrationContainer from '../IllustrationContainer'
import USPTOContainer from '../USPTOContainer'

import useStyles from './styles'
import { setTimelineSelectedItem, setTimelineSelectedAsset } from '../../../../actions/uiActions'

const options = {
  height: '100%',
  autoResize: true,
  stack: true,
  orientation: 'bottom',
  zoomKey: 'ctrlKey',
  moveable: true,
  zoomable: true,
  horizontalScroll: true,
  verticalScroll: false,
  zoomFriction: 30,
  zoomMin: 1000 * 60 * 60 * 24 * 7,
  // cluster: {
  //   titleTemplate: 'Cluster containing {count} events.<br/> Zoom in to see the individual events.',
  //   showStipes: false,
  //   // maxItems: 4,
  //   clusterCriteria: (firstItem, secondItem) => {
  //     return (firstItem.customerName === secondItem.customerName)
  //   }
  // },
  template: function(item, element, data) {
    // if (data.isCluster) {
    //   return `<span class="cluster-header">Cluster</span><div>containing ${data.items.length} items </div>`
    // }
    return `<span>${data.customerName}</span>`
  },
}

const convertDataToItem = (assetsCustomer) => {
  const assetType = Number.isInteger(assetsCustomer.tab_id) ? convertTabIdToAssetType(assetsCustomer.tab_id) : 'default'
  const customerFirstName = assetsCustomer.tab_id == 9 ? assetsCustomer.customerName.split(' ')[0] : assetsCustomer.customerName
  return ({
    content: '',
    type: 'point',
    start: new Date(assetsCustomer.exec_dt),
    customerName: customerFirstName,
    assetType,
    rawData: assetsCustomer,
    className: `asset-type-${assetType}`,
    collection: [ { id: assetsCustomer.id, totalAssets: assetsCustomer.totalAssets } ],
    title: `
      <div>
        <span><strong>Transaction Date:</strong> ${moment(assetsCustomer.exec_dt).format('ll')}</span> 
        <span><strong>Other Party:</strong> ${assetsCustomer.customerName}</span>
        <span><strong>Number of Assets:</strong> ${assetsCustomer.totalAssets}</span>
      </div>
    `,
  })
}

const TimelineContainer = ({ data }) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const timelineRef = useRef()
  const timelineContainerRef = useRef()
  const items = useRef(new DataSet())

  const selectedAssetsTypes = useSelector(state => state.patenTrack2.selectedAssetsTypes)
  const selectedCompaniesList = useSelector(state => state.patenTrack2.selectedCompaniesList)
  const selectedAssetsCustomers = useSelector(state => state.patenTrack2.selectedAssetsCustomers)
  const selectedItem = useSelector(state => state.ui.timeline.selectedItem)

  const setSelectedItem = useCallback((item) => {
    dispatch(setTimelineSelectedItem(item))
  }, [ dispatch ])

  const setSelectedAsset = useCallback((asset) => {
    dispatch(setTimelineSelectedAsset(asset))
  }, [ dispatch ])

  const [ timelineRawData, setTimelineRawData ] = useState([])
  const [ timelineItems, setTimelineItems ] = useState([])

  const [ isLoadingTimelineData, setIsLoadingTimelineData ] = useState(false)
  const [ isLoadingTimelineRawData, setIsLoadingTimelineRawData ] = useState(false)


  const onSelect = useCallback((properties) => {
    if (properties.items.length === 0) {
      setSelectedItem()
    } else {
      const item = items.current.get(properties.items[0])
      setSelectedAsset({ type: 'transaction', id: item.rawData.id })
      setSelectedItem(item)
    }
  }, [ setSelectedItem, setSelectedAsset ])

  const onRangeChange = useCallback((properties) => {
    setIsLoadingTimelineData(true)
  }, [])

  const onRangeChanged = useCallback(_debounce((properties) => {
    const updatedItems = timelineItems.filter((item) => (item.start >= properties.start && item.start <= properties.end))
    items.current = new DataSet()
    items.current.add(updatedItems)
    timelineRef.current.setItems(items.current)
    setIsLoadingTimelineData(false)
  }, 1000), [ timelineItems ])

  useEffect(() => {
    if (!selectedItem && timelineRef.current) {
      timelineRef.current.setSelection([])
    }
  }, [ selectedItem, timelineRef ])

  const paramsUrl = useMemo(() => {
    const tabIds = selectedAssetsTypes.map(assetsType => convertAssetTypeToTabId(assetsType))
    return [
      // timelineStart && `from=${new Date(timelineStart).toISOString()}`,
      // timelineEnd && `to=${new Date(timelineEnd).toISOString()}` ,
      selectedAssetsTypes.length && `tabs=[${encodeURI(tabIds)}]`,
      selectedCompaniesList.length && `companies=[${encodeURI(selectedCompaniesList.map(company => company.id))}]`, 
      selectedAssetsCustomers.length && `customers=[${encodeURI(selectedAssetsCustomers)}]`, 
    ].filter(Boolean).join('&')
  }, [ selectedAssetsCustomers, selectedAssetsTypes, selectedCompaniesList ])

  useEffect(() => {
    timelineRef.current = new Timeline(timelineContainerRef.current, [], options)
  }, [])

  useEffect(() => {
    if (selectedAssetsTypes.length === 0 || selectedCompaniesList.length === 0) return setTimelineRawData([])
    const getTimelineRawDataFunction = async () => {
      setIsLoadingTimelineRawData(true)
      const { data } = await PatenTrackApi.getTimelineData(paramsUrl)
      setTimelineRawData(data)
      setIsLoadingTimelineRawData(false)
    } 
    
    if (selectedCompaniesList.length > 0) {
      getTimelineRawDataFunction()
    } else {
      setTimelineRawData([])
    }
  }, [ paramsUrl, selectedAssetsTypes, selectedCompaniesList ])

  useEffect(() => {
    items.current = new DataSet()
    timelineRef.current.setOptions(options)
    timelineRef.current.on('select', onSelect)
    timelineRef.current.on('rangechanged', onRangeChanged)
    timelineRef.current.on('rangechange', onRangeChange)    
    return () => {
      timelineRef.current.off('select', onSelect)
      timelineRef.current.off('rangechange', onRangeChange)
      timelineRef.current.off('rangechanged', onRangeChanged)
    } 
  }, [ onRangeChange, onRangeChanged, onSelect ])


  useEffect(() => {
    if (isLoadingTimelineRawData) return
    const clusteredItems = timelineRawData.reduce((result, dataItem) => {
      const itemName = dataItem.tab_id == 9 ? dataItem.customerName.split(' ')[0] : dataItem.customerName

      if (result[`${itemName}_${dataItem.exec_dt}`]) {
        result[`${itemName}_${dataItem.exec_dt}`].collection.push({ id: dataItem.id, totalAssets: dataItem.totalAssets })
        result[`${itemName}_${dataItem.exec_dt}`].totalAssets = result[`${itemName}_${dataItem.exec_dt}`].totalAssets + dataItem.totalAssets
        result[`${itemName}_${dataItem.exec_dt}`].title = `
        <div>
          <span><strong>Transaction Date:</strong>${moment(dataItem.exec_dt).format('ll')}</span> 
          <span><strong>Other Party:</strong> ${dataItem.customerName}</span>
          <span><strong>Number of Assets:</strong> ${dataItem.totalAssets} assets</span>
        </div>
      `
      } else {
        result[`${itemName}_${dataItem.exec_dt}`] = convertDataToItem(dataItem)
      }
      return result
    }, {})
    const convertedItems = Object.values(clusteredItems).sort((a, b) => (new Date(a.start) > new Date(b.start)))  
    // const convertedItems = timelineRawData.map(convertDataToItem).sort((a, b) => (new Date(a.start) > new Date(b.start)))
    setTimelineItems(convertedItems)
    items.current = new DataSet()
    let start = new moment().subtract(1, 'year')
    let end = new moment().add(1, 'months')

    if (convertedItems.length > 0) {
      const startIndex = convertedItems.length < 100 ? (convertedItems.length - 1) : 99
      start = convertedItems.length ? new moment(convertedItems[startIndex].start).subtract(1, 'week') : new Date()
      end = new moment().add(1, 'month')
      items.current.add(convertedItems.slice(0, startIndex))
    }
    timelineRef.current.setItems(items.current)
    timelineRef.current.setOptions({ ...options, start, end })
  }, [ timelineRawData, isLoadingTimelineRawData ])

  return (
      <div className={classes.root}>
        <div
          style={{ 
            display: timelineRawData.length ? 'block' : 'hidden',
            filter: `blur(${isLoadingTimelineRawData ? '4px' : 0})`
          }}
          ref={timelineContainerRef}
          className={classes.timeline}
        />
        {
          isLoadingTimelineData &&
          <CircularProgress size={15} color={'secondary'} className={classes.timelineProcessingIndicator} />
          // <div className={classes.onRangeChangeContainer}>
          //   <div className={classes.onRangeChangeMessage}>
          //     <div>Processing Transactions</div>
          //     <LinearProgress color='secondary' />
          //   </div>
          // </div>
        }
        <div className={classes.legend}>
          {selectedAssetsTypes.map((assetType) => (
            <div key={`legend-assetType-${assetType}`} className={classes.legendAssetType}>
              <div className={`${classes.tag} asset-type-${assetType}`}></div>
              <div className={classes.name}>{assetType}</div>
            </div>
          ))}
        </div>

        { isLoadingTimelineRawData && <CircularProgress className={classes.loader} /> }
      </div>
  )
}

export default TimelineContainer
