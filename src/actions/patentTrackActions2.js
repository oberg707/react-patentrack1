import * as types from './actionTypes2'
import PatenTrackApi, { DEFAULT_CUSTOMERS_LIMIT, DEFAULT_TRANSACTIONS_LIMIT, DEFAULT_PATENTS_LIMIT } from '../api/patenTrack2'

import { toggleLifeSpanMode } from './uiActions'

export const setCompaniesList = data => {
  return {
    type: types.SET_COMPANIES_LIST,
    data,
  }
}

export const fetchCompaniesList = () => async dispatch => {
  const { data } = await PatenTrackApi.getCompaniesList()
  dispatch(setCompaniesList(data))
}

export const setSelectedCompaniesList = data => {
  return {
    type: types.SET_SELECTED_COMPANIES_LIST,
    data,
  }
}

export const setSelectedAssetsTypes = data => {
  return {
    type: types.SET_SELECTED_ASSETS_TYPES,
    data,
  }
}

export const setAssetsCompanies = (assetType, data) => {
  return {
    type: types.SET_ASSETS_COMPANIES,
    assetType,
    data,
  }
}

export const setAssetsCustomers = (assetType, data, { append = false }) => {
  return {
    type: types.SET_ASSETS_CUSTOMERS,
    assetType,
    data,
    append,
  }
}

export const setAssetsCustomersLoading = data => {
  return {
    type: types.SET_ASSETS_CUSTOMERS_LOADING,
    payload: data,
  }
}

export const setAssetsCustomersLoadingMore = data => {
  return {
    type: types.SET_ASSETS_CUSTOMERS_LOADING_MORE,
    payload: data,
  }
}

export const getAssetsCustomers = (assetType, companyIds) => {
  return async dispatch => {
    dispatch(setAssetsCustomersLoading(true))
    const { data } = await PatenTrackApi.fetchAssetsCustomers(assetType, companyIds)
    dispatch(setAssetsCustomersLoading(false))
    dispatch(setAssetsCustomers(assetType, data, { append: false }))
  }
}

export const  getMoreAssetsCustomers = (assetType, companyIds, offset) => {
  return async dispatch => {
    dispatch(setAssetsCustomersLoadingMore(true))
    const { data } = await PatenTrackApi.fetchMoreAssetsCustomers(assetType, companyIds, { offset, limit: DEFAULT_CUSTOMERS_LIMIT })
    dispatch(setAssetsCustomersLoadingMore(false))
    dispatch(setAssetsCustomers(assetType, data, { append: true }))
  }
}

export const setSelectedAssetsCustomers = data => {
  return {
    type: types.SET_SELECTED_ASSETS_CUSTOMERS,
    data,
  }
}


export const setAssetsTransactions = (assetType, companyId, customerId, data) => {
  return {
    type: types.SET_ASSETS_TRANSACTIONS,
    assetType,
    companyId,
    customerId,
    data,
  }
}

export const setAssetsTransactionsLoading = data => {
  return {
    type: types.SET_ASSETS_TRANSACTIONS_LOADING,
    payload: data,
  }
}

export const getAssetsTransactions = (assetType, companyId, customerId, offset) => {
  return async dispatch => {
    dispatch(setAssetsTransactionsLoading(true))
    const { data } = await PatenTrackApi.getAssetsTransactions(assetType, companyId, customerId, { offset, limit: DEFAULT_TRANSACTIONS_LIMIT })
    dispatch(setAssetsTransactionsLoading(false))
    dispatch(setAssetsTransactions(assetType, companyId, customerId, data))
  }
}

export const setSelectedAssetsTransactions = data => {
  return {
    type: types.SET_SELECTED_ASSETS_TRANSACTIONS,
    data,
  }
}

export const setAssetsTransactionsLifeSpan = (assetType, companyId, customerId, transactionId, data) => {
  return {
    type: types.SET_ASSETS_TRANSACTIONS_LIFE_SPAN,
    assetType,
    companyId,
    customerId,
    transactionId,
    data,
  }
}

export const getAssetsTransactionsEvents = (assetType, companyId, customerId, transactionId) => {
  return async dispatch => {
    const { data } = await PatenTrackApi.getAssetsTransactionsEvents(assetType, companyId, customerId, transactionId)
    dispatch(toggleLifeSpanMode(true))
    dispatch(setAssetsTransactionsLifeSpan(assetType, companyId, customerId, transactionId, data))
  }
}


export const setAssetsPatents = (assetType, companyId, customerId, transactionId, data) => {
  return {
    type: types.SET_ASSETS_PATENTS,
    assetType,
    companyId,
    customerId,
    transactionId,
    data,
  }
}

export const setAssetsPatentsLoading = data => {
  return {
    type: types.SET_ASSETS_PATENTS_LOADING,
    payload: data,
  }
}

export const getAssetsPatents = (assetType, companyId, customerId, transactionId, offset) => {
  return async dispatch => {
    dispatch(setAssetsPatentsLoading(true))
    const { data } = await PatenTrackApi.getAssetsPatents(assetType, companyId, customerId, transactionId, { offset, limit: DEFAULT_PATENTS_LIMIT })
    dispatch(setAssetsPatentsLoading(false))
    dispatch(setAssetsPatents(assetType, companyId, customerId, transactionId, data))
  }
}

export const setSelectedAssetsPatents = data => {
  return {
    type: types.SET_SELECTED_ASSETS_PATENTS,
    data,
  }
}


// SET_ASSETS_COMPANIES
// SET_ASSETS_CUSTOMERS

export const setAssetsIllustrationLoading = data => {
  return {
    type: types.SET_ASSETS_ILLUSTRATION_LOADING,
    data,
  }
}


export const setAssetsIllustration = data => {
  return {
    type: types.SET_ASSET_ILLUSTRATION,
    data,
  }
}

export const setAssetsUSPTOLoading = data => {
  return {
    type: types.SET_ASSETS_USPTO_LOADING,
    data,
  }
}


export const setAssetsUSPTO = data => {
  return {
    type: types.SET_ASSETS_USPTO,
    data,
  }
}

export const setCommentsEntity = data => {
  return {
    type: types.SET_COMMENTS_ENTITY,
    data,
  }
}

export const setPDFFile = ( file ) => {
  return {
    type: types.SET_PDF_FILE,
    file
  }
}

export const setPDFView = (view) => {
  return {
    type: types.SET_PDF_VIEW,
    view
  }
}

export const setPDFViewModal = (view) => {
  return {
    type: types.SET_PDF_VIEW_MODAL,
    view
  }
}

export const setPdfTabIndex = (index) => {
  return {
    type: types.SET_PDF_TAB,
    payload: index
  }
}

export const setConnectionData = (data) => {
  return {
    type: types.SET_CONNECTION_DATA,
    data
  }
}

export const setConnectionBoxView = (flag) => {
  return {
    type: types.SET_CONNECTION_VIEW_BOX,
    flag
  }
}