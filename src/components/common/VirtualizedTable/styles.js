import { makeStyles } from '@material-ui/core/styles'

const styles = makeStyles((theme) => ({
  td: {
    display: 'flex',
  },
  th: {
    display: 'flex',
    border: 'none',
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  tableRow: {
    cursor: 'pointer',
    borderBottom: '1px solid #5c5c5c',
    '&.ReactVirtualized__Table__headerRow': {
      backgroundColor: '#292929',
    },
  },
  tableCell: {
    flex: 1,
    whiteSpace: 'nowrap',
    border: 'none',
    alignItems: 'center',
    padding: '0',
    overflow: 'hidden',
    margin: '0 10px'
  },
}))

export default styles
