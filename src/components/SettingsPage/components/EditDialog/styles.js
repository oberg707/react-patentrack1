import { makeStyles } from '@material-ui/core/styles'
import { fade } from '@material-ui/core'

export default makeStyles((theme) => ({
  dialogContent: {
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    display: 'flex',
    '& .MuiFormControl-root': {
      width: 'calc(50% - 10px)',
      margin: '10px 0',
    },
  },
  loaderContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 2,
    backgroundColor: fade(theme.palette.common.black, 0.5),
  },
  paper: {
    minWidth: 320,
    maxWidth: 700,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
  },
  formControl: {
    marginTop: theme.spacing(2),
    minWidth: 120,
  },
  formControlLabel: {
    marginTop: theme.spacing(1),
  },
}))