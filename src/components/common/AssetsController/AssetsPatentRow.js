import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Box from '@material-ui/core/Box'
import Checkbox from '@material-ui/core/Checkbox'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'

import useStyles from './styles'
import { 
  setAssetsIllustration, 
  setSelectedAssetsPatents,
  setCommentsEntity,
} from '../../../actions/patentTrackActions2'



import { assetLegalEvents, assetFamily } from '../../../actions/patenTrackActions'
import { toggleLifeSpanMode } from '../../../actions/uiActions'

const AssetsPatentRow = ({ assetType, companyId, customerId, transactionId, patentId, index }) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const selectedAssetsPatents = useSelector(state => state.patenTrack2.selectedAssetsPatents)
  const assetsPatent = useSelector(state => state.patenTrack2.assets[assetType][customerId].transactions[transactionId].patents[patentId])

  const handleClickListItem = useCallback(() => {
    dispatch(toggleLifeSpanMode(false))
    dispatch(setSelectedAssetsPatents([ assetsPatent.patent || assetsPatent.application ]))
    dispatch(setAssetsIllustration({ type: 'patent', id: assetsPatent.patent || assetsPatent.application }))
    dispatch(setCommentsEntity({ type: 'asset', id: assetsPatent.patent || assetsPatent.application }))
    dispatch(assetLegalEvents(assetsPatent.application))
    dispatch(assetFamily(assetsPatent.application))
  }, [ assetsPatent, dispatch ])
  
  return (
    <ListItem
      className={`${classes.assetListItem}`}
      button
      selected={selectedAssetsPatents.includes(assetsPatent.patent || assetsPatent.application)}
      tabIndex={-1}
      onClick={handleClickListItem}
    >
      <Box width={55} /> 
      {/* <ListItemAvatar>
        { <Checkbox
          className={classes.checkbox}
          edge="end"
          onChange={handleClickListItem}
          checked={selectedAssetsPatents.includes(assetsPatent.patent || assetsPatent.application)}
        /> }
      </ListItemAvatar> */}
        
      <ListItemText
        primary={assetsPatent.patent ? assetsPatent.patent : assetsPatent.application}
      />
    </ListItem>
  )
}

export default AssetsPatentRow
