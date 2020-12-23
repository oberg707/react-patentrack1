import React, { useState, useEffect, useRef } from 'react'
import moment from 'moment'

import Paper from '@material-ui/core/Paper'

import 'vis-timeline/styles/vis-timeline-graph2d.min.css'

import { DataSet } from 'vis-data/esnext'
import { Timeline } from 'vis-timeline/esnext'
import CircularProgress from '@material-ui/core/CircularProgress'
import useStyles from './styles'

const options = {
    height: '90%',
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
      let text = data.description.split(',');
      const firstText = text[0];
      text.splice(0,1);
      text = firstText+'<br/>'+text.join(',');
      return `<span>${text}</span>`
    },
}

const convertDataToItem = (eventItem, index) => {
    const assetType = 'default'
    return ({
        id: index + 1,
        content: '',
        type: 'point',
        start: new Date(eventItem.eventdate),
        assetType,
        rawData: eventItem,
        number: eventItem.event_code,
        description: eventItem.maintainence_code.event_description,
        className: `asset-type-${assetType}`,
        collection: [],
        title: `
            <div>         
            <span>${moment(new Date(eventItem.eventdate)).format('MM/DD/YYYY')}</span>          
            </div>
        `
    })
}

const LegalEventsContainer = ({ events }) => {
    const classes = useStyles()
    const timelineRef = useRef()
    const timelineContainerRef = useRef()
    const items = useRef(new DataSet())
    const [ legalEvents, setLegalEvents ] = useState([])
    const [ timelineItems, setTimelineItems ] = useState([])
    const [ isLoadingTimelineData, setIsLoadingTimelineData ] = useState(false)
    const [ isLoadingTimelineRawData, setIsLoadingTimelineRawData ] = useState(true)
    const [ timelineStart, setTimelineStart ] = useState(moment().subtract(1, 'year'))
    const [ timelineEnd, setTimelineEnd ] = useState(moment().add(1, 'day'))

    useEffect(() => {
        timelineRef.current = new Timeline(timelineContainerRef.current, [], options)
    }, [])

  useEffect(() => {
    if(events.length == 0) return setLegalEvents([])
    const getLegalEventListFunction = async () => {
      setLegalEvents(events)
      setIsLoadingTimelineRawData(false)
    }
    getLegalEventListFunction()
  }, [ events ])

  useEffect(() => {
    if (isLoadingTimelineRawData) return
    const convertedItems = events.map((event, index) => convertDataToItem(event, index))
    console.log('convertedItems',convertedItems)
    setTimelineItems(convertedItems)
    items.current = new DataSet()
    let start = new moment().subtract(1, 'year')
    let end = new moment().add(1, 'months')

    if (convertedItems.length > 0) {
      start = convertedItems.length ? new moment(convertedItems[0].start).subtract(1, 'week') : new Date()
      end = new moment(convertedItems[convertedItems.length - 1].start).add(5, 'year')
      items.current.add(convertedItems)
    }
    timelineRef.current.setItems(items.current)
    timelineRef.current.setOptions({ ...options, start, end, min:start, max:end  })
}, [ legalEvents, isLoadingTimelineRawData, events ])

  return (
    <Paper className={classes.root} square>
        <>
            <div
                style={{ 
                    display: legalEvents.length ? 'block' : 'hidden',
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
        </>
    </Paper>
  )
}

export default LegalEventsContainer
