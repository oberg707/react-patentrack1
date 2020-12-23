import * as types from './uiTypes'

export const toggleUsptoMode = () => ({
  type: types.TOGGLE_USPTO_MODE
})

export const toggleLifeSpanMode = (flag) => ({
  type: types.TOGGLE_LIFE_SPAN_MODE,
  flag
})

export const toggleFamilyMode = (flag) => ({
  type: types.TOGGLE_FAMILY_MODE,
  flag
})

export const toggleFamilyItemMode = (flag) => ({
  type: types.TOGGLE_FAMILY_ITEM_MODE,
  flag: flag
})

export const setTimelineSelectedItem = (selectedItem) => ({
  type: types.SET_SELECTED_TIMELINE_ITEM,
  selectedItem
})

export const setTimelineSelectedAsset = (selectedAsset) => ({
  type: types.SET_TIMELINE_SELECTED_ASSET,
  selectedAsset
})
