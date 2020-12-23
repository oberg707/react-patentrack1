import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CircularProgress from '@material-ui/core/CircularProgress'

import PatenTrackApi from '../../../../api/patenTrack2'
import { setAssetsUSPTOLoading } from '../../../../actions/patentTrackActions2'

import useStyles from './styles'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

const USPTOContainer = ({ asset, onClose }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [ USPTO, setUSPTO ] = useState()

  const isLoadingAssetUSPTO = useSelector(state => state.patenTrack2.loadingAssetIllustration)

  useEffect(() => {
    const getUSPTO = async () => {
      dispatch(setAssetsUSPTOLoading(true))
      if (asset.type === 'patent') {
        const { data } = await PatenTrackApi.geteAssetUSPTOByPatentNumber(1, asset.id)
        setUSPTO(data)
      } else if (asset.type === 'transaction') {
        const { data } = await PatenTrackApi.geteAssetUSPTOByPatentNumber(0, asset.id)
        setUSPTO(data)
      }
      dispatch(setAssetsUSPTOLoading(false))

    }

    getUSPTO()
  }, [ asset, dispatch ])

  return (
    <div className={classes.root}>
      {
        onClose && (
          <IconButton className={classes.close} onClick={onClose} size={'small'}>
            <CloseIcon />
          </IconButton>
        )
      }
      <div className={classes.forceStrech}>
        {
          isLoadingAssetUSPTO ?
            <CircularProgress className={classes.loader} /> :
            (USPTO && (
                <iframe className={classes.forceStrech} src={USPTO.url} title={USPTO.url} />
              )
            )
        }
      </div>
    </div>
  )
}

export default USPTOContainer
