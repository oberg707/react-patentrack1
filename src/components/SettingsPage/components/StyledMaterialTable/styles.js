import makeStyles from '@material-ui/core/styles/makeStyles'

export default makeStyles(() => ({
  materialTableContainer: {
    '& .MuiToolbar-root': {
      minHeight: 0,
      background: '#303030',
    },
    '& .MuiPaper-elevation2': {
      boxShadow: 'none',
    }
  }
}))