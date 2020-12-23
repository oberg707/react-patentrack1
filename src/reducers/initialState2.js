import { assetsTypes } from '../utils/assetTypes'

export default {
  auth: {
    auth_email_sent: false,
    isLoadingReset: true,
    password_reset: false,
    redirect_page: false,
  },
  dashboard: {
    companiesList: [],
    companyListLoading: false,
    assetsCustomersLoading: false,
    assetsCustomersLoadingMore: false,
    assetsTransactionsLoading: false,
    assetsPatentsLoading: false,
        
    assets: assetsTypes.reduce((result, assetType) => {
      result[assetType] = {}
      return result
    }, {}),
    
    selectedCompaniesList: [],
    selectedAssetsTypes: [ 'acquisitions' ],
    selectedAssetsCustomers: [],
    selectedAssetsTransactions: [],
    selectedAssetsPatents: [],
    transaction_life_span: [],
    loadingAssetIllustration: false,
    loadingAssetUSPTO: false,
    assetIllustration: null,
    assetUSPTO: {},
    selectedCommentsEntity: null,
    pdfFile: null,
    pdfView: null,
    pdfViewModal: null,
    pdfTab: null,
    connectionBoxData: null,
    connectionBoxView: null
  },
  settings: {
    users: { loading: true, list: [], initialized: false },
    professionals:  { loading: true, list: [], initialized: false },
    documents:  { loading: true, list: [], initialized: false },
    companyAddresses:  { loading: true, list: [], initialized: false },
    companyLawyers:  { loading: true, list: [], initialized: false },
    companyTelephones:  { loading: true, list: [], initialized: false },
    lawFirms: { loading: true, list: [], initialized: false },
    selected_law_firm: [],
    selected_companies_list: [],
    selectedPortfolio: null,
    companies_to_add_lawfirm: [] 
  },
  ui: {
    usptoMode: false,
    lifeSpanMode: false,
    familyMode: false,
    familyItemMode: false,
    timeline: {
      selectedItem: null,
      selectedAsset: null,
    },
  },
  assets: {
    records: {
      isLoading: false,
      data: [],
      selected: [],
      countTime: 0,
    },
    errors: {
      isLoading: false,
      data: [],
      selected: [],
      countTime: 0,
    },
    completed: {
      isLoading: false,
      data: [],
      selected: [],
      countTime: 0,
    },
  }
}
