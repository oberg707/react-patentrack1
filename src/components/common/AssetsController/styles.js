import { makeStyles } from '@material-ui/styles'

export default makeStyles((theme) => ({
    root: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    topBar: {
        padding: 10,
    },
    title: {
        fontSize: 20,
    },
    list: {
        overflowY: 'auto',
        flex: 1,
        marginTop: 40,
        '& .MuiListItemAvatar-root': {
            minWidth: 0,
        },
        '& .MuiListItem-gutters': {
            paddingLeft: 5,
            paddingRight: 5,
        },
        
    },
    listHeight:{
        maxHeight: '300px',
        overflowY: 'auto'
    },
    listItem: {
        '&:focus':{
            outline:'none'
        },
        '&:active':{
            outline:'none'
        }
    },
    boxItem: {
        minWidth: 15
    },
    checkbox: {
        padding: 5,
        '&.MuiIconButton-edgeEnd': {
            marginRight: 0,
        },
    },
    patentIndex: {
        backgroundColor: 'transparent',
        color: 'initial'
    },
    listItemTextContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    expandIcon: {
        '& svg': {
            width: 10,
            height: 10,
        }
    },
    assetTitle: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        marginRight: 5,
    },
    assetTitleTotalCount: {
        minWidth: 20,
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
    selectAllBtn: {
      margin: '3px 7px 3px 9px',
      padding: 0,
    },
    totalSelected: {
      position: 'absolute',
      right: '5px'
    },
    listInfinityLoader: {
      width: '100%',
      marginTop: '5px',
      marginBottom: '5px',
      textAlign: 'center'
    }
}))
