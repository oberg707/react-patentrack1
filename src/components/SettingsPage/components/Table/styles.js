import makeStyles from '@material-ui/core/styles/makeStyles'

export default makeStyles((theme) => ({
  table: {
    backgroundColor: theme.palette.background.default,
    '& th': {
      '&.MuiTableCell-stickyHeader': {
        backgroundColor: '#292929',
      },
      '&:first-child': {
        paddingLeft: 16
      },
    },
    '& td': {
      '&:first-child': {
        paddingLeft: 16
      },
    }
  },
  tableContainer: {
    flex: 1,
  },
  actionTh: {
    width: 20,
  },
  actions: {
    display: 'flex',
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  emptyTable: {
    height: 80,
    '& td': {
      textAlign: 'center',
    }
  }
}))