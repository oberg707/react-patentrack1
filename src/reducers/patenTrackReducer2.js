import * as types from '../actions/actionTypes2'
import initialState from './initialState2'

const arrayToObjectByKey = (array, key) =>
  array.reduce((result, item) => {
    result[item[key]] = item
    return result
  }, {})

const patenTrackReducer = (state = initialState.dashboard, action) => {
  switch (action.type) {
    case types.SET_COMPANY_LIST_LOADING:
      return {
        ...state,
        companyListLoading: action.payload,
      }
    case types.SET_COMPANIES_LIST:
      return {
        ...state,
        companiesList: [ ...action.data ],
        selectedCompaniesList: [ ...action.data ],
      }
    case types.SET_SELECTED_COMPANIES_LIST:
      return {
        ...state,
        selectedCompaniesList: action.data,
      }

    case types.SET_SELECTED_ASSETS_TYPES:
      return {
        ...state,
        selectedAssetsTypes: action.data,
      }

    case types.SET_ASSETS_CUSTOMERS:
      
      return {
        ...state,
        assets: {
          ...state.assets,
          [action.assetType]: action.append 
            ?  { ...state.assets[action.assetType],  ...arrayToObjectByKey(action.data, 'customer_id') } 
            : arrayToObjectByKey(action.data, 'customer_id'),
        },
      }
    case types.SET_ASSETS_CUSTOMERS_LOADING:
      return {
        ...state,
        assetsCustomersLoading: action.payload,
      }
    case types.SET_ASSETS_CUSTOMERS_LOADING_MORE: 
      return {
        ...state,
        assetsCustomersLoadingMore: action.payload,
      }
    case types.SET_SELECTED_ASSETS_CUSTOMERS:
      return {
        ...state,
        selectedAssetsCustomers: action.data,
      }

    case types.SET_ASSETS_TRANSACTIONS_LOADING:
      return {
        ...state,
        assetsTransactionsLoading: action.payload,
      }
    case types.SET_ASSETS_TRANSACTIONS:
      return {
        ...state,
        assets: {
          ...state.assets,
          [action.assetType]: {
            ...state.assets[action.assetType],
            [action.customerId]: {
              ...state.assets[action.assetType][action.customerId],
              transactions: action.data.length === 0 ? [] : {
                ...state.assets[action.assetType][action.customerId].transactions,
                ...arrayToObjectByKey(action.data, 'id')
              },
            },
          },
        },
      }
    case types.SET_ASSETS_TRANSACTIONS_LIFE_SPAN:
      return {
        ...state,
        transaction_life_span: action.data
      }
    case types.SET_SELECTED_ASSETS_TRANSACTIONS:
      return {
        ...state,
        selectedAssetsTransactions: action.data,
      }

    case types.SET_ASSETS_PATENTS_LOADING:
      return {
        ...state,
        assetsPatentsLoading: action.payload,
      }
    case types.SET_ASSETS_PATENTS:
      return {
        ...state,
        assets: {
          ...state.assets,
          [action.assetType]: {
            ...state.assets[action.assetType],
            [action.customerId]: {
              ...state.assets[action.assetType][action.customerId],
              transactions: {
                ...state.assets[action.assetType][action.customerId].transactions, 
                [action.transactionId]: {
                  ...state.assets[action.assetType][action.customerId].transactions[action.transactionId],
                  patents: action.data.length === 0 ? [] : {
                    ...state.assets[action.assetType][action.customerId].transactions[action.transactionId].patents,
                    ...arrayToObjectByKey(action.data, 'application')
                  },
                },
              },
            },
          },
        },
      }
    case types.SET_SELECTED_ASSETS_PATENTS:
      return {
        ...state,
        selectedAssetsPatents: action.data,
      }

    case types.SET_ASSETS_ILLUSTRATION_LOADING:
      return {
        ...state,
        loadingAssetIllustration: action.data,
      }

    case types.SET_ASSETS_USPTO_LOADING:
      return {
        ...state,
        loadingAssetUSPTO: action.data,
      }

    case types.SET_ASSET_ILLUSTRATION:
      return {
        ...state,
        assetIllustration: action.data,
      }

    case types.SET_ASSETS_USPTO:
      return {
        ...state,
        assetsUSPTO: action.data,
      }

    case types.SET_COMMENTS_ENTITY:
      return {
        ...state,
        selectedCommentsEntity: action.data,
      }

    case types.SET_PDF_FILE:
      return {
        ...state,
        pdfFile: action.file,
      }

    case types.SET_PDF_VIEW:
      return {
        ...state,
        pdfView: action.view,
      }
    
    case types.SET_PDF_VIEW_MODAL:
      return {
        ...state,
        pdfViewModal: action.view,
      }

    case types.SET_PDF_TAB:
      return {
        ...state,
        pdfTab: action.payload,
      }

    case types.SET_CONNECTION_DATA:
      return {
        ...state,
        connectionBoxData: action.data,
      }
    case types.SET_CONNECTION_VIEW_BOX:
      return {
        ...state,
        connectionBoxView: action.flag,
      }  
    default:
      return state
  }
}

export default patenTrackReducer
