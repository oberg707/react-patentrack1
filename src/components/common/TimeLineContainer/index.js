import React, { useState, useEffect, useRef, useCallback } from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'

import useStyles from './styles'
import FullWidthSwitcher from '../FullWidthSwitcher'
import TabsContainer from '../Tabs'
import { connect } from 'react-redux'
import { getAssetsOutsource, getCollectionIllustration, getTimeLine, setTimelineTabIndex, setCurrentCollectionID, setCurrentAsset, setIllustrationUrl, getTimelineFilterWithDate, setTimeLine, setTimeLineLoading, cancelRequest, setPDFFile, setPdfTabIndex, setPDFView, share, setConnectionData, setConnectionBoxView } from '../../../actions/patenTrackActions'
import 'font-awesome/css/font-awesome.min.css'
import classnames from 'classnames'
import moment from 'moment'

/*import modifyingData from './TimeLine';
import assignmentTimeline from "./TimeLine1";*/
import modifyTimeline from './modifytimeline'
import { assignmentTimeline, timelineOnChange } from './newtimeline'

import PatentrackDiagram from '../PatentrackDiagram'

function checkMe(data) {
  console.log('frame loaded....')
  const iframe = document.getElementById('outsource')
  if (typeof iframe.contentWindow !== 'undefined') {
    if (typeof iframe.contentWindow.renderData === 'function') {
      iframe.contentWindow.renderData(data)
      iframe.contentWindow.applyZoomFunction()
    }
  }
}

function loadTimeline(data) {
  const iframe = document.getElementById('timeline')
  if (typeof iframe.contentWindow !== 'undefined') {
    if (
      typeof iframe.contentWindow.renderData === 'function' &&
      typeof data.assignment_assignors !== 'undefined'
    ) {
      iframe.contentWindow.renderData(data)
    }
  }
}
function TimeLineContainer(props) {
  const { timelineTab, setTimelineTabIndex } = props
  const classes = useStyles()
  const [ showSwitcher, setShowSwitcher ] = useState(false)
  
  const targetRef = useRef()
  const ref = useRef(null)
  /*const [timeInterval, setTimeInterval] =  useState( null );*/
  const [ startDate, setStartDate ] = useState(null)
  const [ endDate, setEndDate ] = useState(null)
  const WAIT_INTERVAL = 5000
  const DATE_FORMAT = 'YYYY-MM-DD'

  const [ timelineObject, setTimelineObject ] = useState(null)

  const [ parent_width, setParentWidth ] = useState(0)

  const [ bottomToolbarPosition, setBottomToolbarPosition ] = useState(0)

  const [ topPosition, setTopPosition ] = useState(0)

  const [ itemsDateList, setItemsDateList ] = useState([])

  const updateContainerWidth = useCallback(() => {
    if (targetRef.current) {

      const patentelement = targetRef.current.parentElement.parentElement
      setBottomToolbarPosition(props.screenHeight - patentelement.offsetHeight - 37)
      const clientRect = patentelement.getBoundingClientRect()
      setTopPosition(clientRect.top  + 6)
      setParentWidth(parseInt(targetRef.current.offsetWidth))

    }
  }, [ props.screenHeight ])

  /*const [flag, setFlag] = useState(0);*/

  var timeInterval,
    flag = 0
  const activeTabChange = tabId => {
    console.log('tabId', tabId)
    if (
      (tabId === 1 &&
        (props.selectedRFID !== '' || props.currentAsset !== '')) ||
      (tabId === 2 && (props.currentAsset !== '' || props.selectedRFID !== ''))
    ) {
      console.log('tabId', tabId, props)
      setTimelineTabIndex(tabId)
    } else {
      setTimelineTabIndex(0)
    }
  }
  useEffect(() => {
    console.log('EFFECT')
    if (targetRef.current) {
      updateContainerWidth()
    }
    const iframe = document.getElementById('outsource')
    if (timelineTab === 1 && iframe) {
      if (typeof iframe.contentWindow !== 'undefined') {
        if (typeof iframe.contentWindow.renderData === 'function') {
          iframe.contentWindow.renderData(props.assets)
          iframe.contentWindow.applyZoomFunction()
        }
      }
    }
  }, [ props.assets, timelineTab, updateContainerWidth ])

  const itemClickCallBack = t => {
    props.getCollectionIllustration(t.id, 0)
  }

  useEffect(() => {
    console.log('TIMELINE USE EFFECT')
    // eslint-disable-next-line react-hooks/exhaustive-deps
    flag = 0

    if (targetRef.current) {
      console.log('PARENTWIDTH', targetRef.current.offsetWidth)
      setParentWidth(parseInt(targetRef.current.offsetWidth))
    }
    if (timelineTab === 0 && props.timeLine.items) {      
      (async () => {        
        const passingData = await modifyTimeline(props.timeLine)
        console.log('passingData', passingData)
        assignmentTimeline(
          passingData.items,
          passingData.itemDates,
          props.setCurrentCollectionID,
          props.setCurrentAsset,
          props.setIllustrationUrl,
          props.getAssetsOutsource,
          props.add_years,
          itemClickCallBack,
        )
      })()
    }
  }, [ props.timeLine, timelineTab ])

  if (timelineObject !== null) {    
    timelineObject.on('rangechanged', function(properties) {
      if (
        startDate !== moment(properties.start).format(DATE_FORMAT) ||
        endDate !== moment(properties.end).format(DATE_FORMAT)
      ) {
        if (properties.byUser === true) {
          let checkScroll = 0

          if (
            endDate !== null &&
            new Date(properties.end).getTime() > new Date(endDate).getTime()
          ) {
            checkScroll = 1
          }

          setStartDate(moment(properties.start).format(DATE_FORMAT))
          setEndDate(moment(properties.end).format(DATE_FORMAT))

          if (itemsDateList.length > 0) {
            let min = Math.min(...itemsDateList)
            let newStart = new Date(properties.start).getTime()

            let max = Math.max(...itemsDateList)
            let newEnd = new Date(properties.end).getTime()

            if (
              ((checkScroll === 0 && newStart < min) ||
                (checkScroll === 1 && newEnd > max)) &&
              flag === 0
            ) {
              flag = 1
              if (checkScroll === 0) {
                setStartDate(null)
              } else if (checkScroll === 1) {
                setEndDate(null)
              }

              clearTimeout(timeInterval)
              timeInterval = setTimeout(() => {
                props.cancelRequest()
                if (startDate !== null && endDate !== null && flag === 0) {
                  //props.setTimeLineLoading( false );
                  //props.setTimeLine( [] );
                  //props.getTimelineFilterWithDate(props.nestGridTab, startDate, endDate, checkScroll);
                }
              }, WAIT_INTERVAL)
            }
          }
        }
      }
    })
  }

  const updateSwitcher = flag => {
    updateContainerWidth()

    setShowSwitcher( flag )
  }

  const handlePdfView = (obj) => {
    console.log('handlePdfView', obj)
    if(typeof obj.document_file != 'undefined') {
      props.setPDFFile({ document: obj.document_file, form: obj.document_form, agreement: obj.document_agreement }) 
      props.setPDFView(true)
      props.setPdfTabIndex(2) 
    } else {
      alert('No document found!')
    }
  }

  const handleShare = (obj) => {
    console.log('handleShare', obj)
    if(obj != null && typeof obj.original_number != undefined && obj.original_number != null) {
      let form = new FormData()
      form.append('assets', obj.original_number)
      form.append('type', 2)
      props.share(form)
    }
  }
  
  const handleComment = (obj) => {
    console.log('handleComment', obj)
  }

  const handleConnectionBox = (obj) => {
    console.log('handleConnectionBox', obj)
    if(typeof obj.popup != 'undefined'){
      props.setConnectionData(obj)
      props.setConnectionBoxView(true)
    }
  }

  /*if(timelineObject != null) {    
    timelineObject.on("rangechanged", function(properties){
      if(startDate !==moment(properties.start).format(DATE_FORMAT) && endDate !==moment(properties.end).format(DATE_FORMAT)) {
        setStartDate(moment(properties.start).format(DATE_FORMAT));
        setEndDate(moment(properties.end).format(DATE_FORMAT));
        if(properties.byUser === true) {
          clearTimeout(timeInterval);
          setTimeInterval(setTimeout(() => {
            props.cancelRequest();
            if(startDate !==null && endDate !==null) {
              props.setTimeLineLoading( false );
              props.setTimeLine( [] );
              props.getTimelineFilterWithDate(startDate, endDate); 
            }    
          }, WAIT_INTERVAL)); 
        }
      }
      console.log(properties, moment(properties.start).format(DATE_FORMAT), moment(properties.end).format(DATE_FORMAT));      
    });
  }<div id="timeline"/><iframe id={"timeline"} onLoad={() => loadTimeline(timelineData)} className={classes.outsource} src={"./timeline/index.html"}/><iframe ref={ref} id={"outsource"} onLoad={() => checkMe(props.assets)} className={classes.outsource} src={props.illustrationUrl}/>*/
/**
 *  
 */
  return (
    <div
      className     = {classes.timeLineContainer}
      onMouseOver={() => {
        updateSwitcher(true)
      }}
      onMouseLeave={() => {
        updateSwitcher(false)
      }}
    >
      <div className={classes.timeLineWrapper}>
        <div className={classes.container}>
          {timelineTab === 0 && (
            <div style={{ position: 'relative', height: '100%' }}>
              <PerfectScrollbar
                options={{
                  suppressScrollX: true,
                  minScrollbarLength: 30,
                  maxScrollbarLength: 50,
                }}
                className={classes.scrollbar}
              >
                <div id="timeline" />
              </PerfectScrollbar>
              <div className={classes.btnGroups}>
                <i className={classnames('fa fa-plus', classes.button)} id={'zoomIn'}/>
                <i className={classnames('fa fa-minus', classes.button)} id={'zoomOut'}/>
              </div>
            </div>
          ) 
          }
          {
            timelineTab === 1 && (
            <div
              className={classes.outSourceWrapper} ref={targetRef}
            >
              <div className={classes.padding} >
                <PatentrackDiagram data={props.assets} connectionBox={handleConnectionBox} comment={handleComment} share={handleShare} pdfView={handlePdfView} titleTop={topPosition} toolbarBottom={bottomToolbarPosition} parentWidth={parseInt(parent_width)} key={props.assets + '_' + Math.random()} />             
              </div>
            </div>
          )}
          {timelineTab === 2 && props.assetsOutsource.url && (
            <div className={classes.outSourceWrapper}>
              <div className={classes.padding}>
                <iframe
                  className={classes.outsource}
                  src={props.assetsOutsource.url}
                  title={props.assetsOutsource.url}
                />
              </div>
            </div>
          )}
        </div>
        <div style={{ marginBottom: 5 }}>
          <TabsContainer
            activeTabId={timelineTab}
            setActiveTabId={activeTabChange}
            tabs={[ 'Timeline', 'Illustration', 'USPTO' ]}
          />
        </div>
      </div>
      <FullWidthSwitcher show={showSwitcher} widget="timeline" />
    </div>
  )
}

const mapStateToProps = state => {
  return {
    timeLine: state.patenTrack.timeLine,
    assetsOutsource: state.patenTrack.assetsOutsource,
    assets: state.patenTrack.assets,
    isLoading: state.patenTrack.timeLineLoading,
    timelineTab: state.patenTrack.timelineTab,
    illustrationUrl: state.patenTrack.illustrationUrl
      ? state.patenTrack.illustrationUrl
      : 'about:blank',
    selectedRFID: state.patenTrack.selectedRFID,
    currentAsset: state.patenTrack.currentAsset,
    add_years: state.patenTrack.add_years,
    nestGridTab: state.patenTrack.nestGridTab,
    screenHeight: state.patenTrack.screenHeight,
  }
}

const mapDispatchToProps = {
  getAssetsOutsource,
  getCollectionIllustration,
  getTimeLine,
  setTimelineTabIndex,
  setCurrentCollectionID,
  setCurrentAsset,
  setIllustrationUrl,
  getTimelineFilterWithDate,
  setTimeLine,
  setTimeLineLoading,
  cancelRequest,
  setPDFFile,  
  setPdfTabIndex,
  setPDFView,
  share,
  setConnectionData,
  setConnectionBoxView
}

export default connect(mapStateToProps, mapDispatchToProps)(TimeLineContainer)
