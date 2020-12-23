
export const assetsTypes = [
    'acquisitions',
    'courtOrders',
    'employees',
    'licenseIn',
    'licenseOut',
    'mergersIn',
    'mergersOut',
    'options',
    'sales',
    'securities',
    'other',
  ]
  
  export const defaultAssetsCountByTypeCounter = assetsTypes.reduce((result, assetType) => {
    result[assetType] = 0
    return result
   }, {})
  
  export const convertTabIdToAssetType = (tabId) => {
    switch(parseInt(tabId)){
      case 0:
        return 'acquisitions'
      case 1:
        return 'sales'
      case 2:
        return 'licenseIn'
      case 3:
        return 'licenseOut'
      case 4:
        return 'securities'
      case 5:
        return 'mergersIn'
      case 6:
          return 'mergersOut'
      case 7:
        return 'options'
      case 8:
        return 'courtOrders'
      case 9:
        return 'employees'
      case 10:
      default:
        return 'other'
    }
  }
  
  export const convertAssetTypeToTabId = (assetType) => {
    switch(assetType){
      case 'acquisitions':
        return 0
      case 'sales':
        return 1
      case 'licenseIn':
        return 2
      case 'licenseOut':
        return 3
      case 'securities':
        return 4
      case 'mergersIn':
        return 5
      case 'mergersOut':
          return 6
      case 'options':
        return 7
      case 'courtOrders':
        return 8
      case 'employees':
        return 9
      case 'other':
      default:
        return 10
    }
  }