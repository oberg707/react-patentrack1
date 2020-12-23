import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import _startCase from 'lodash/startCase'
import Box from '@material-ui/core/Box'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import Checkbox from '@material-ui/core/Checkbox'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import ExpandMoreIcon from '@material-ui/icons/Remove'
import ExpandLessIcon from '@material-ui/icons/Add'
import CircularProgress from '@material-ui/core/CircularProgress'

import { numberWithCommas } from '../../../utils/numbers'

import InfiniteScroll from 'react-infinite-scroll-component'

import { DEFAULT_TRANSACTIONS_LIMIT } from '../../../api/patenTrack2'

import {
  setAssetsTransactions,
  getAssetsTransactions,  
  setSelectedAssetsCustomers,
  setSelectedAssetsTransactions,
  setSelectedAssetsPatents,
  setCommentsEntity,
  setAssetsIllustration,
} from '../../../actions/patentTrackActions2'

import { toggleFamilyMode, toggleLifeSpanMode, toggleFamilyItemMode } from '../../../actions/uiActions'

import AssetsTransactionRow from './AssetsTransactionRow'
import useStyles from './styles'

const AssetCustomerRow = ({ assetType, companyId, customerId, isLoading }) => {
  const classes = useStyles() 
  const dispatch = useDispatch()

  const [ offset, setOffset ] = useState(0)

  const selectedAssetsCustomers = useSelector(state => state.patenTrack2.selectedAssetsCustomers)
  const isLoadingAssetsTransactions = useSelector(state => state.patenTrack2.assetsTransactionsLoading )
  const assetsCustomer = useSelector(state => state.patenTrack2.assets[assetType][customerId])

  const [ isExpanded, setIsExpanded ] = useState(false)

  const handleToggleAssetCompanyCheckbox = useCallback(() => {
    let updatedSelectedAssetsCustomers = []
    if (selectedAssetsCustomers.includes(customerId)) {
      updatedSelectedAssetsCustomers = selectedAssetsCustomers.filter(
        existingAssetCustomer => existingAssetCustomer !== customerId,
      )
    } else {
      updatedSelectedAssetsCustomers = [ ...selectedAssetsCustomers, customerId ]
    }

    dispatch(setSelectedAssetsCustomers(updatedSelectedAssetsCustomers))
  }, [ customerId, dispatch, selectedAssetsCustomers ])

  const handleToggleAssetsCustomerListItem = useCallback(() => {
    dispatch(setSelectedAssetsCustomers([ customerId ]))
    dispatch(setAssetsIllustration(null))
    dispatch(setCommentsEntity({ type: 'customer', id: assetsCustomer.name }))
    dispatch(toggleFamilyMode(false))
    dispatch(toggleLifeSpanMode(false))
    dispatch(toggleFamilyItemMode(false))
  }, [ assetsCustomer.name, customerId, dispatch ])

  const handleToggleExpandAssetCustomer = useCallback(e => {
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }, [ isExpanded ])

  useEffect(() => {
    if (!selectedAssetsCustomers.includes(customerId)) {
      setIsExpanded(false)
      dispatch(setSelectedAssetsTransactions([]))
      dispatch(setSelectedAssetsPatents([]))
    }
  }, [ customerId, dispatch, selectedAssetsCustomers ])

  useEffect(() => {
    if (isExpanded) {
      dispatch(getAssetsTransactions(assetType, companyId, customerId, 0))
      setOffset(DEFAULT_TRANSACTIONS_LIMIT)
    } else {
      dispatch(setAssetsTransactions(assetType, companyId, customerId, []))
      setOffset(0);
    }
    
  }, [ assetType, companyId, customerId, dispatch, isExpanded ])

  const handleInfinityLoadMore = useCallback(() => {
    dispatch(getAssetsTransactions(assetType, companyId, customerId, offset))
    setOffset(currOffset => (currOffset + DEFAULT_TRANSACTIONS_LIMIT))
  }, [ assetType, dispatch, offset, companyId, customerId ])

  return (
    <div>
      <ListItem
        className={`${classes.listItem}`}
        tabIndex={-1}
        selected={selectedAssetsCustomers.includes(customerId)}
        onClick={handleToggleAssetsCustomerListItem}
        dense
      >
        <Box width={15} className={classes.boxItem} />
        <ListItemAvatar>
        {
          selectedAssetsCustomers.includes(customerId) &&
          isLoadingAssetsTransactions &&
          isExpanded ? (
            <CircularProgress size={16} color={'#fff'} style={{marginTop: 4}} />
          ) : (
            <IconButton 
              size="small" 
              onClick={handleToggleExpandAssetCustomer} 
              className={classes.expandIcon}
            >
              {isExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </IconButton>
          )
        }
        </ListItemAvatar>

        <ListItemText classes={{ primary: classes.listItemTextContainer }}>
          <Checkbox
            className={classes.checkbox}
            edge="end"
            onChange={handleToggleAssetCompanyCheckbox}
            checked={selectedAssetsCustomers.includes(customerId)}
          />
          <span className={classes.assetTitle}>{_startCase(assetsCustomer.name)}</span>
          <span className={classes.assetTitleTotalCount}>({numberWithCommas(assetsCustomer.transactionCount)})</span>
        </ListItemText>
      </ListItem>
      
      <Divider component="li" />

      <Collapse
        in={isExpanded}
        timeout="auto"
        unmountOnExit
      >
        <List
          dense
          disablePadding
          className={classes.listHeight}
          id={`collapse_list_transactions_${customerId}`}
        >
          {assetsCustomer.transactions && Object.keys(assetsCustomer.transactions).length >= 0 &&
            <InfiniteScroll
              dataLength={Object.keys(assetsCustomer.transactions).length}
              next={handleInfinityLoadMore}
              hasMore={Object.keys(assetsCustomer.transactions).length < assetsCustomer.transactionCount}
              scrollableTarget={`collapse_list_transactions_${customerId}`}
              loader={<div className={classes.listInfinityLoader} ><CircularProgress size={20} color='secondary' /></div>}
            >
              {Object.keys(assetsCustomer.transactions).map(transactionId => (
                <AssetsTransactionRow
                  key={`${assetType}-company-${companyId}-customer-${customerId}-transaction-${transactionId}`}
                  assetType={assetType}
                  companyId={companyId}
                  customerId={customerId}
                  transactionId={transactionId}
                />
              ))}
            </InfiniteScroll>
          }
        </List>
      </Collapse>
    </div>
  )
}

export default AssetCustomerRow
