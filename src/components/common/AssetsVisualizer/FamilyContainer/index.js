import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import _debounce from 'lodash/debounce'
import Paper from '@material-ui/core/Paper'
import { DataSet } from 'vis-data/esnext'
import { Timeline } from 'vis-timeline/esnext'

import CircularProgress from '@material-ui/core/CircularProgress'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'

import { 
    setFamilyItemDisplay
  } from '../../../../actions/patenTrackActions'

import {
    toggleFamilyItemMode
} from '../../../../actions/uiActions'

import 'vis-timeline/styles/vis-timeline-graph2d.min.css'

import useStyles from './styles'

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
    template: function(item, element, data) {
      return `<span><img width='40' src='./assets/images/flags/${data.country.toLowerCase()}.png'/><span style='position:relative;top:-15px;left:5px;'>${data.number}</span></span>`
    },
}

const convertDataToItem = (familyItem) => {
    const assetType = 'default'
    const rawDate = familyItem.application_date
    return ({
        id: familyItem.id,
      content: '',
      type: 'point',
      start: new Date(`${rawDate.substr(0,4)}-${rawDate.substr(4,2)}-${rawDate.substr(6,2)}`),
      assetType,
      zoomMin: 3456e5,
      rawData: familyItem,
      number: familyItem.patent_number != '' ? familyItem.patent_number : familyItem.application_number,
      country: familyItem.publication_country,
      className: `asset-type-${assetType}`,
      collection: [],
      title: `
        <div>         
          <span>${moment(new Date(rawDate.substr(0,4)+'-'+ rawDate.substr(4,2)+'-'+rawDate.substr(6,2))).format('MM/DD/YYYY')}</span>          
        </div>
      `
    })
}

const FamilyContainer = ({ family, onClose }) => {
    const classes = useStyles()

    const timelineRef = useRef()
    const timelineContainerRef = useRef()
    const items = useRef(new DataSet())
    const dispatch = useDispatch()
    const [ timelineRawData, setTimelineRawData ] = useState([])
    const [ timelineItems, setTimelineItems ] = useState([])
    const [ isLoadingTimelineData, setIsLoadingTimelineData ] = useState(false)
    const [ isLoadingTimelineRawData, setIsLoadingTimelineRawData ] = useState(true)
    const [ timelineStart, setTimelineStart ] = useState(moment().subtract(1, 'year'))
    const [ timelineEnd, setTimelineEnd ] = useState(moment().add(1, 'day'))
    const selectedAsset = useSelector(state => state.patenTrack2.selectedAssetsPatents)

    const onSelect = useCallback((properties) => {        
        if (properties.items.length > 0)  {
            const item = items.current.get(properties.items[0])
            console.log('item.rawData', item.rawData, toggleFamilyItemMode)
            dispatch(setFamilyItemDisplay(item.rawData))
            dispatch(toggleFamilyItemMode(true))
        }
    }, [ dispatch ])
    
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
    
    const handleClickAway = () => {
        /*timelineRef.current.setSelection([])
        toggleFamilyItemMode(false)
        setFamilyItemDisplay({})*/
    }

    useEffect(() => {
        timelineRef.current = new Timeline(timelineContainerRef.current, [], options)
    }, [])

    useEffect(() => {
        if (family.length === 0 ) return setTimelineRawData([])
        const getTimelineRawDataFunction = async () => {
            setTimelineRawData(family)
            setIsLoadingTimelineRawData(false)
            console.log('FAMILY', selectedAsset)
            // const findIndex = family.findIndex(item => item.application_number == selectedAsset[selectedAsset.length - 1] || item.patent_number == selectedAsset[selectedAsset.length - 1])
            const findIndex = family.findIndex(item => item.application_number == '6392902' || item.patent_number == '6392902')
            console.log('SELECTED FAMILY', findIndex)
            if(findIndex >= 0) {
                console.log(family[findIndex])
                dispatch(setFamilyItemDisplay(family[findIndex]))
                dispatch(toggleFamilyItemMode(true))
            }
        }        
        getTimelineRawDataFunction()
    }, [ dispatch, family, selectedAsset ])

    useEffect(() => {
        items.current = new DataSet()
        timelineRef.current.setOptions(options)
        timelineRef.current.on('select', onSelect)
        return () => {
          timelineRef.current.off('select', onSelect)
        } 
    }, [ onSelect ])


    useEffect(() => {
        if (isLoadingTimelineRawData) return
        const convertedItems = timelineRawData.map(convertDataToItem)
        setTimelineItems(convertedItems)
        items.current = new DataSet()
        let start = new moment().subtract(1, 'year')
        let end = new moment().add(1, 'months')
    
        if (convertedItems.length > 0) {
          start = convertedItems.length ? new moment(convertedItems[0].start).subtract(1, 'year') : new Date()
          end = new moment(convertedItems[convertedItems.length - 1].start).add(2, 'year')
          items.current.add(convertedItems)
        }
        timelineRef.current.setItems(items.current)
        timelineRef.current.setOptions({ ...options, start, end, min: start, max: end })
    }, [ timelineRawData, isLoadingTimelineRawData ])

    return(
        <Paper className={classes.root}>
            <ClickAwayListener onClickAway={handleClickAway}>
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
                    }
                    { isLoadingTimelineRawData && <CircularProgress className={classes.loader} /> }
                </div>
            </ClickAwayListener>
        </Paper>
    )
}


export default FamilyContainer