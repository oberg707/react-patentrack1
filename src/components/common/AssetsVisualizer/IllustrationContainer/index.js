import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import CircularProgress from '@material-ui/core/CircularProgress'
import Modal from '@material-ui/core/Modal'

import PatenTrackApi from '../../../../api/patenTrack2'
import PatentrackDiagram from '../../PatentrackDiagram'
import { setAssetsIllustrationLoading, setPDFFile, setPDFView, setPdfTabIndex, setConnectionData, setConnectionBoxView } from '../../../../actions/patentTrackActions2' 

import PdfViewer from '../../../common/PdfViewer'


import useStyles from './styles'

const IllustrationContainer = ({ asset, setIllustrationRecord, isFullscreenOpen }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [ illustrationData, setIllustrationData ] = useState()
  const targetRef = useRef()
  const pdfViewModal = useSelector(state => state.patenTrack2.pdfViewModal)
  const isLoadingAssetIllustration = useSelector(state => state.patenTrack2.loadingAssetIllustration)
  const screenHeight = useSelector(state => state.patenTrack.screenHeight)
  const [ parent_width, setParentWidth ] = useState(0)
  const [ bottomToolbarPosition, setBottomToolbarPosition ] = useState(0)
  const [ topPosition, setTopPosition ] = useState(0)

  const updateContainerWidth = useCallback(() => {
    if (targetRef.current) {
      const patentelement = targetRef.current.parentElement
      console.log(patentelement)
      setBottomToolbarPosition(screenHeight - patentelement.offsetHeight - 170)
      const clientRect = patentelement.getBoundingClientRect()
      setTopPosition(clientRect.top)
      setParentWidth(parseInt(targetRef.current.offsetWidth))
    }
  }, [ screenHeight ])

  useEffect(() => {
    if (targetRef.current) {
      updateContainerWidth()
    }
    const getIllustration = async () => {
      if (!asset) return 
      dispatch(setAssetsIllustrationLoading(true))
      if (asset.type === 'patent') {
        const { data } = await PatenTrackApi.getAssetsByPatentNumber(asset.id)
        setIllustrationData(data)
        if(setIllustrationRecord) { setIllustrationRecord(data) }
      } else if (asset.type === 'transaction') {
        const { data } = await PatenTrackApi.getCollectionIllustration(asset.id)
        setIllustrationData(data)
        if(setIllustrationRecord) { setIllustrationRecord(data) }
      }
      dispatch(setAssetsIllustrationLoading(false))
    }

    getIllustration()
  }, [ asset, dispatch, updateContainerWidth, isFullscreenOpen ])

  const handlePdfView = (obj) => {
    if (typeof obj.document_file != 'undefined') {
      dispatch(setPDFFile({ document: obj.document_file, form: obj.document_form, agreement: obj.document_agreement }))
      dispatch(setPDFView(true))
      dispatch(setPdfTabIndex(2)) 
    } else {
      alert('No document found!')
    }
  }

  const handleShare = async (obj) => {
    if (obj != null && typeof obj.original_number != undefined && obj.original_number != null) {
      let form = new FormData()
      form.append('assets', obj.original_number)
      form.append('type', 2)

      const res = await PatenTrackApi.shareIllustration(form)
      if (typeof res == 'object') {
        let shareURL = res.data
        if (shareURL.indexOf('share') >= 0) {
          /**
           * just for temporary replacing
           */
          shareURL = shareURL.replace('https://share.patentrack.com','http://167.172.195.92:3000')
          window.open(shareURL,'_BLANK')
          //dispatch(setAssetShareURL(shareURL));
        }
      }
    }
  }
  
  const handleComment = (obj) => {
    console.log('handleComment', obj)
  }

  const handleConnectionBox = (obj) => {
    if (typeof obj.popup != 'undefined') {
      dispatch(setConnectionData(obj))
      dispatch(setConnectionBoxView(true))
    }
  }

  return (
    <div className={classes.root}>
      {
        pdfViewModal &&
        <Modal open={pdfViewModal}>
          <PdfViewer display={'true'} />
        </Modal>
      }

      <div className={classes.forceStrech} ref={targetRef}>
        {
          isLoadingAssetIllustration ?
          <CircularProgress /> :
          (
            illustrationData && (
              <PatentrackDiagram 
                data={illustrationData} 
                connectionBox={handleConnectionBox} 
                comment={handleComment} 
                share={handleShare} 
                pdfView={handlePdfView} 
                titleTop={topPosition} 
                toolbarBottom={bottomToolbarPosition} 
                parentWidth={parseInt(parent_width)} 
                key={illustrationData + '_' + Math.random()} />             
            )
          )
        }
      </div>
    </div>
  )
}

export default IllustrationContainer