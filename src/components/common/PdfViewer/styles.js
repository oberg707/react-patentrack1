import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  pdfContainer: {
    position: 'relative',
    zIndex: 9999,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfWrapper: {
    position: 'relative',
    top: '4px',
    left: 0,
    bottom: 0,
    right: 0,
    width: '90%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgb(82, 86, 89)',
  },
  scrollbar: {
    flexGrow: 1,
    overflow: 'hidden',
    height: '100%',
    width: '100%',
  },
  container: {
    flexGrow: 1,
    height: '100%',
    border: '1px solid #363636',
    position: 'relative',
    overflow: 'hidden',
  },
  outsource: {
    width: '100%',
    border: '0px',
  },
  fullView: {
    width: '100% !important',
  },
  close: {
    position: 'absolute',
    zIndex: 11,
    left: '3px',
    top: '1px',
    cursor: 'pointer',
  }, 
  tabs: {
    backgroundColor: 'rgb(50, 54, 57)',
  },
  fullscreenBtn: {
    position: 'absolute',
    top: 0,
    right: '20px',
    zIndex: 1
  }
}))
