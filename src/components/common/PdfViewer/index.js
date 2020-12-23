import React, { useState, useEffect, useRef } from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'

import useStyles from './styles'
import FullWidthSwitcher from '../FullWidthSwitcher'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import IconButton from '@material-ui/core/IconButton'
import { Close } from '@material-ui/icons'
import FullscreenIcon from '@material-ui/icons/Fullscreen'

import { connect } from 'react-redux'
import { setPDFFile,  setPDFView, setPdfTabIndex } from '../../../actions/patenTrackActions'
import { setPDFViewModal } from '../../../actions/patentTrackActions2'

/*let pdfFile = "";*/

function PdfViewer(props) {
  const viewerRef = useRef();
  const { pdfTab, setPdfTabIndex } = props
  const classes = useStyles()
  const [ showSwitcher, setShowSwitcher ] = useState(0)
  const [ mainPdf, setMainPdf ] = useState('about:blank')
  const [ formPdf, setFormPdf ] = useState('about:blank')
  const [ agreementPdf, setAgreementPdf ] = useState('about:blank')
  const [ fullView, setFullView ] = useState('')
  
  const checkHeight = (t) => {
    /*console.log("t", t);
    console.log("window.innerHeight", window.innerHeight);*/
    console.log(viewerRef.current);
    const containerName = t == 0 ? 'iframe_main' : t == 1 ? 'iframe_agreement' : 'iframe_form'
    const parentElement = viewerRef.current
    const iframeElement = parentElement.querySelector(`#${containerName}`)
    const height = window.innerHeight - 111
    console.log(height)
    iframeElement.style.height = height + 'px'
    parentElement.style.height = height + 'px'
  }

  useEffect(()=> {
    if(props.pdfView == 'true') {
      setFullView(classes.fullView)
    }
    if(props.pdfFile) {
      if(props.pdfFile.document != '') {
        setMainPdf(props.pdfFile.document)
      }
      if(props.pdfFile.form != '') {
        setFormPdf(props.pdfFile.form)
      }
      if(props.pdfFile.agreement != '') {
        setAgreementPdf(props.pdfFile.agreement)
      }
    }
  },[ classes.fullView, props.pdfFile, props.pdfView ])
  

  const closeViewer = () => {
    if(props.display === "false") {
      props.setPDFFile({ document: '', form: '', agreement: '' })
      props.setPDFView(false)
      props.setPdfTabIndex(2)  
    } else {
      props.setPDFViewModal(false)
    }
  }

  const handleClickOpenFullscreen = () => {
    props.setPDFViewModal(true)
  }
  
  return (
    <div
      className={classes.pdfContainer}
    >
      <div className={`${classes.pdfWrapper} ${fullView}`} id={'pdfViewer'} ref={viewerRef}>
        <IconButton onClick={closeViewer} size="small" className={classes.close}>
          <Close />
        </IconButton>
        {
          props.display === "false" && <IconButton size="small" className={classes.fullscreenBtn} onClick={handleClickOpenFullscreen}>
          <FullscreenIcon />
          </IconButton>
        }
        
        <div className={classes.container}>
          
          {
            (pdfTab === 2 || pdfTab === 3) &&
            <div style={{ position: 'relative', height: '100%' }}>
              <PerfectScrollbar
                options={{
                  suppressScrollX: true,
                  minScrollbarLength: 30,
                  maxScrollbarLength: 50,
                }}
                className={classes.scrollbar}>
                 <iframe id={'iframe_main'} title='main iframe' onLoad={() => checkHeight(0)} className={classes.outsource} src={mainPdf}/>
              </PerfectScrollbar>              
            </div>
          }
          
          {
            pdfTab === 0 &&
            <div style={{ position: 'relative', height: '100%' }}>
              <PerfectScrollbar
                options={{
                  suppressScrollX: true,
                  minScrollbarLength: 30,
                  maxScrollbarLength: 50,
                }}
                className={classes.scrollbar}>
                 <iframe id={'iframe_agreement'} title='agreement iframe' onLoad={() => checkHeight(1)} className={classes.outsource} src={agreementPdf}/>
              </PerfectScrollbar>              
            </div>
          }
          {
            pdfTab === 1 &&
            <div>
              <div >
                <iframe id={'iframe_form'} title='form iframe' className={classes.outsource} onLoad={() => checkHeight(2)} src={formPdf}/>
              </div>
            </div>
          }          
        </div>
        {
          pdfTab < 3
          ?
          <Tabs
            value={pdfTab}
            onChange={(e, id) => setPdfTabIndex(id)}
            className={classes.tabs}
          >
            {
              [ 'Agreement', 'Form', 'Main' ].map((tab) => (
                <Tab
                  key={tab}
                  label={tab}
                  className={classes.tabItem}
                />
              ))
            }
          </Tabs>
          :
          ''
        }
        
      </div>
    </div>
  )
}


const mapStateToProps = state => {
    /*if(window.pdf !== '') {
        pdfFile = window.pdf
    }*/
    return {
      pdfTab: state.patenTrack.pdfTab,
      pdfFile: state.patenTrack.pdfFile,
      pdfView: state.patenTrack.pdfView
    }
}

const mapDispatchToProps = {
  setPDFFile,
  setPDFView,
  setPDFViewModal,
  setPdfTabIndex  
}

export default connect(mapStateToProps, mapDispatchToProps)(PdfViewer)