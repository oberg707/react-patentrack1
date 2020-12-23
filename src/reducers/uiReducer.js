import * as types from '../actions/uiTypes'
import initialState from './initialState2'


const uiReducer = (state = initialState.ui, action) => {
  switch (action.type) {
    case types.SET_SELECTED_TIMELINE_ITEM: {
      return {
        ...state,
        timeline: {
          ...state.timeline,
          selectedItem: action.selectedItem
        }
      }
    }
    case types.SET_TIMELINE_SELECTED_ASSET: {
      return {
        ...state,
        timeline: {
          ...state.timeline,
          selectedAsset: action.selectedAsset
        }
      }
    }
    case types.TOGGLE_USPTO_MODE: {
      return { 
        ...state,
        usptoMode: !state.usptoMode 
      }
    }

    case types.TOGGLE_LIFE_SPAN_MODE: {
      return { 
        ...state,
        lifeSpanMode: action.flag }
    }

    case types.TOGGLE_FAMILY_MODE: {
      return { 
        ...state,
        familyMode: action.flag
      }
    }

    case types.TOGGLE_FAMILY_ITEM_MODE: {
      return { 
        ...state,
        familyItemMode: action.flag
      }
    }

    

    default:
      return state
  }
}

export default uiReducer
