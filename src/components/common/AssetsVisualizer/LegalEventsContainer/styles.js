import { makeStyles } from '@material-ui/core/styles'
import { indigo, purple, blue, pink, teal, cyan, lime, green, orange, grey } from '@material-ui/core/colors'

export default makeStyles(theme => ({
  root: {
    height: 'calc(100% - 38px)',
    width: '100%',
    position: 'relative',
  },
  loader: {
    position: 'absolute',
    zIndex: 100,
    top: '50%',
    left: '50%',
  },
  timeline: {
    height: '100%',
    width: '100%',
    // '& .vis-center .vis-content': {
    //   transform: 'translateY(0px) !important',
    //   height: '100% !important',
    // },
    // '& .vis-center .vis-itemset': {
    //   height: '329px !important',
    //   overflowY: 'auto',
    //   overflowX: 'hidden',
    // },
    '& .vis-timeline':{
      height: '100% !important'
    },
    '& .vis-left.vis-panel.vis-vertical-scroll, & .vis-right.vis-panel.vis-vertical-scroll': {
      overflowY: 'hidden',
    },
    '& .vis-item': {
      fontSize: 12,
      backgroundColor: 'transparent',
      borderColor: '#424242',
      color: '#d6d6d6',
      '& .vis-dot.asset-type-default': {
        borderColor: indigo[500],
      },
      '& .vis-dot.asset-type-acquisitions': {
        borderColor: indigo[500],
      },
      '& .vis-dot.asset-type-sales': {
        borderColor: purple[500],
      },
      '& .vis-dot.asset-type-licenseIn': {
        borderColor: blue[500],
      },
      '& .vis-dot.asset-type-licenseOut': {
        borderColor: pink[500],
      },
      '& .vis-dot.asset-type-securities': {
        borderColor: teal[500],
      },
      '& .vis-dot.asset-type-mergersIn': {
        borderColor: cyan[500],
      },
      '& .vis-dot.asset-type-mergersOut': {
        borderColor: cyan[200],
      },
      '& .vis-dot.asset-type-options': {
        borderColor: lime[500],
      },
      '& .vis-dot.asset-type-courtOrders': {
        borderColor: green[500],
      },
      '& .vis-dot.asset-type-employees': {
        borderColor: orange[500],
      },
      '& .vis-dot.asset-type-other': {
        borderColor: grey[500],
      },
    },
    '& .vis-cluster': {
      backgroundColor: '#3f51b547',
    },
    '& .vis-dot': {
      borderColor: indigo[500],
      backgroundColor: indigo[500],
    },
    '& .vis-item.vis-box': {
      borderColor: indigo[500],
      backgroundColor: indigo[500],
      '&.asset-type-default': {
        backgroundColor: indigo[500],
      },
      '&.asset-type-acquisitions': {
        backgroundColor: indigo[500],
      },
      '&.asset-type-sales': {
        backgroundColor: purple[500],
      },
      '&.asset-type-licenseIn': {
        backgroundColor: blue[500],
      },
      '&.asset-type-licenseOut': {
        backgroundColor: pink[500],
      },
      '&.asset-type-securities': {
        backgroundColor: teal[500],
      },
      '&.asset-type-mergersIn': {
        backgroundColor: cyan[500],
      },
      '&.asset-type-mergersOut': {
        backgroundColor: cyan[200],
      },
      '&.asset-type-options': {
        backgroundColor: lime[500],
      },
      '&.asset-type-courtOrders': {
        backgroundColor: green[500],
      },
      '&.asset-type-employees': {
        backgroundColor: orange[500],
      },
      '&.asset-type-other': {
        backgroundColor: grey[500],
      },
    },
    '& .vis-item.vis-point.vis-selected': {
      backgroundColor: 'inherit',
      color: '#e60000',
      fontWeight: 'bold',
    },
  },
  legend: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: '5px 15px',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 150,
    background: '#424242cc',
    borderRadius: 2,
  },
  legendAssetType: {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    marginTop: 5,
  },
  tag: {
    width: 12,
    height: 12,
    borderRadius: 15,
    marginRight: 10,
    '&.asset-type-default': {
      backgroundColor: indigo[500],
    },
    '&.asset-type-acquisitions': {
      backgroundColor: indigo[500],
    },
    '&.asset-type-sales': {
      backgroundColor: purple[500],
    },
    '&.asset-type-licenseIn': {
      backgroundColor: blue[500],
    },
    '&.asset-type-licenseOut': {
      backgroundColor: pink[500],
    },
    '&.asset-type-securities': {
      backgroundColor: teal[500],
    },
    '&.asset-type-mergersIn': {
      backgroundColor: cyan[500],
    },
    '&.asset-type-mergersOut': {
      backgroundColor: cyan[200],
    },
    '&.asset-type-options': {
      backgroundColor: lime[500],
    },
    '&.asset-type-courtOrders': {
      backgroundColor: green[500],
    },
    '&.asset-type-employees': {
      backgroundColor: orange[500],
    },
    '&.asset-type-other': {
      backgroundColor: grey[500],
    },
  },
  illustrationContainer: {
    top: 120,
    right: 20,
    width: '33%',
    height: '82%',
    display: 'flex',
    zIndex: 111111,
    position: 'fixed',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  onRangeChangeMessage: {
    position: 'absolute',
    background: '#424242cc',
    borderRadius: 2,    
    top: 10,
    right: 30,
    fontSize: 16,
    padding: 10,
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    height: 50,
    justifyContent: 'space-evenly',
  },
  previousBtn: {
    position: 'absolute',
    top: 0,
    left: 0,    
    zIndex: 1111,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    padding: 10,
    transition: 'background 0.5',
    '&:hover': {
      background: '#78787826',
    },
  },
  timelineProcessingIndicator: {
    position: 'absolute',
    top: 10, 
    right: 10,
  },
  nextBtn: {
    position: 'absolute',
    top: 0,
    right: 0,    
    zIndex: 1111,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    padding: 10,
    transition: 'background 0.5',
    '&:hover': {
      background: '#78787826',
    },
  },
}))
