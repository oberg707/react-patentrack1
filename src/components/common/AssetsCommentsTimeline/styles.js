import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {
    height: 'auto',
    minHeight: '100%',
    width: '100%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    '& .MuiButton-textSizeSmall': {
      padding: 0,
      minWidth: 'auto',
      marginRight: '10px'
    }
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  loader: {},
  content: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    /* overflow: 'auto', */
    width: '100%',
    flex: 1,
    '& > div': {
      width: '100%',
      paddingRight: 40,
    },
  },
  addCommentBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  timeline: {
    width: '100%',
    fontSize: 'inherit !important',
    fontWeight: 'inherit !important'
  },
  minimizeButton: {
    position: 'absolute',
    zIndex: 1,
    fontSize: 12,
    top: 5,
    left: 0,
    color: '#fff',
    cursor: 'pointer',
    width: '2rem',
    transition: 'color linear 250ms 0s',
    '&:hover': {
      color: '#d5d5d5'
    }
  }
}))
