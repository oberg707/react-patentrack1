import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  controllersContainer: {
    position: 'absolute',
    width: '100%',
    zIndex: 111,
    fontSize: 9,
    backgroundColor: '#303030',
    transition: 'opacity 0.1s',
    padding: '5px 0 9px',
  },
  controllers: {
    display: 'flex',
    alignItems: 'center',
  },
  totalSelected: {
    position: 'absolute',
    right: '5px'
  },
  selectAllBtn: {
    margin: '3px 7px 3px 9px',
    padding: 0,
  },
  list: {
    overflow: 'auto',
    flex: 1,
    paddingTop: 40,
    '& .MuiListItemIcon-root': {
      minWidth: 20,
    },
  },
  checkbox: {
    padding: 5
  },
  headingText: {

  }
}))
