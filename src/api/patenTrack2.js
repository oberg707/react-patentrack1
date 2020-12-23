import axios from 'axios'
import _toLower from 'lodash/toLower'

import { base_api_url, base_new_api_url } from '../config/config'
import { convertAssetTypeToTabId } from '../utils/assetTypes'

export const DEFAULT_CUSTOMERS_LIMIT = 100
export const DEFAULT_TRANSACTIONS_LIMIT = 15
export const DEFAULT_PATENTS_LIMIT = 15

const getCookie = name => {
  var nameEQ = name + '='
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

const getHeader = () => {
  let token = localStorage.getItem('token')
  if (token === null) {
    token = getCookie('token')
  }
  return {
    headers: {
      'x-access-token': token,
    },
  }
}

const getFormUrlHeader = () => {
  let token = localStorage.getItem('token')
  if (token === null) {
    token = getCookie('token')
  }
  return {
    headers: {
      'x-access-token': token,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }
}

const getMultiFormUrlHeader = () => {
  let token = localStorage.getItem('token')
  if (token === null) {
    token = getCookie('token')
  }
  return {
    headers: {
      'x-access-token': token,
      'Content-Type': 'multipart/form-data',
    },
  }
}

class PatenTrackApi {
  static getSiteLogo() {
    return axios.get(`${base_api_url}/site_logo`, getHeader())
  }

  static getProfile() {
    return axios.get(`${base_new_api_url}/profile`, getHeader())
  }

  static getCompaniesList() {
    return axios.get(`${base_new_api_url}/companies`, getHeader())
  }

  static getUsers() {
    return axios.get(`${base_new_api_url}/users`, getHeader())
  }

  static addUser(user) {
    return axios.post(`${base_new_api_url}/users`, user, getMultiFormUrlHeader())
  }

  static updateUser( user, ID ) {
    return axios.put(`${base_new_api_url}/users/${ID}`, user, getMultiFormUrlHeader())
  }

  static deleteUser( ID ) {
    return axios.delete(`${base_new_api_url}/users/${ID}`, getFormUrlHeader())
  }

  static getLawyers() {
    return axios.get(`${base_new_api_url}/professionals`, getHeader())
  }

  static addLawyer( lawyer ) {
    return axios.post(`${base_new_api_url}/professionals`, lawyer, getFormUrlHeader())
  }

  static updateLawyer( user, ID ) {
    return axios.put(`${base_new_api_url}/professionals/${ID}`, user, getFormUrlHeader())
  }

  static deleteLawyer( ID ) {
    return axios.delete(`${base_new_api_url}/professionals/${ID}`, getFormUrlHeader())
  }

  static getValidateCounter(companies) { 
    return axios.get(`${base_new_api_url}/validity_counter?companies=${companies}`, getHeader())
  } 

  static getPorfolioSummary(selectedCompaniesIds) {
    return axios.get(
      `${base_new_api_url}/customers/portfolios?portfolio=${JSON.stringify(
        selectedCompaniesIds,
      )}`,
      getHeader(),
    )
  }

  static getAssetsLifeSpanSummary(selectedCompaniesIds) {
    return axios.get(
      `${base_new_api_url}/customers/events?portfolio=${JSON.stringify(selectedCompaniesIds)}`,
      getHeader(),
    )
  }

  static getAssetsCompanies(assetsType) {
    const tabId = convertAssetTypeToTabId(assetsType)
    return axios.get(`${base_new_api_url}/tabs/${tabId}`, getHeader())
  }

  static fetchAssetsCustomers(assetsType, companyIds) {
    const tabId = convertAssetTypeToTabId(assetsType)
    return axios.get(`${base_new_api_url}/tabs/${tabId}/customers?companiesIds=${JSON.stringify(companyIds)}&limit=${DEFAULT_CUSTOMERS_LIMIT}`,
      getHeader(),
    )
  }

  static fetchMoreAssetsCustomers(assetsType, companyIds, { offset = 0, limit = DEFAULT_CUSTOMERS_LIMIT }) {
    const tabId = convertAssetTypeToTabId(assetsType)
    return axios.get(`${base_new_api_url}/tabs/${tabId}/customers?companiesIds=${JSON.stringify(companyIds)}&offset=${offset}&limit=${limit}`,
      getHeader(),
    )
  }

  static getAssetsTransactions(assetsType, companyId, customerId, { offset = 0, limit = DEFAULT_TRANSACTIONS_LIMIT }) {
    const tabId = convertAssetTypeToTabId(assetsType)
    return axios.get(
      `${base_new_api_url}/tabs/${tabId}/companies/${companyId}/customers/${customerId}?offset=${offset}&limit=${limit}`,
      getHeader(),
    )
  }

  static getAssetsPatents(assetsType, companyId, customerId, transactionId, { offset = 0, limit = DEFAULT_PATENTS_LIMIT }) {
    const tabId = convertAssetTypeToTabId(assetsType)
    return axios.get(
      `${base_new_api_url}/tabs/${tabId}/companies/${companyId}/customers/${customerId}/transactions/${transactionId}?offset=${offset}&limit=${limit}`,
      getHeader(),
    )
  }

  static getAssetsCompaniesEvents(assetsType) {
    const tabId = convertAssetTypeToTabId(assetsType)
    return axios.get(`${base_new_api_url}/events/tabs/${tabId}`, getHeader())
  }

  static getAssetsCustomersEvents(assetsType, companyId) {
    const tabId = convertAssetTypeToTabId(assetsType)
    return axios.get(
      `${base_new_api_url}/events/tabs/${tabId}/companies/${companyId}`,
      getHeader(),
    )
  }

  static getAssetsTransactionsEvents(assetsType, companyId, customerId, transactionId) {
    const tabId = convertAssetTypeToTabId(assetsType)
    return axios.get(
      `${base_new_api_url}/events/tabs/${tabId}/companies/${companyId}/customers/${customerId}/transactions/${transactionId}`,
      getHeader(),
    )
  }

  static getAssetsPatentsEvents(assetsType, companyId, customerId, transactionId) {
    const tabId = convertAssetTypeToTabId(assetsType)
    return axios.get(
      `${base_new_api_url}/events/tabs/${tabId}/companies/${companyId}/customers/${customerId}/transactions/${transactionId}`,
      getHeader(),
    )
  }

  static getAssetsByApplicationNumberEvents(applicationNumber) {
    return axios.get(`${base_new_api_url}/events/${applicationNumber}`, getHeader())
  }

  // static getPorfolioDataByTabId(selectedCompaniesIds, tabId, offset = 0) {
  //   return axios.get(`${base_new_api_url}/customers/portfolios?portfolio=${JSON.stringify(selectedCompaniesIds)}&tab_id=${tabId}&limit=100&offset=${offset}`, getHeader());
  // }

  static getAssetsByPatentNumber(patentNumber) {
    return axios.get(`${base_new_api_url}/assets/${patentNumber}`, getHeader())
  }

  static getCollectionIllustration(rfID) {
    return axios.get(
      `${base_new_api_url}/collections/${rfID}/illustration`,
      getHeader(),
    )
  }

  static geteAssetUSPTOByPatentNumber(type, patentNumber) {
    return axios.get(
      `${base_new_api_url}/assets/${patentNumber}/${type}/outsource`,
      getHeader(),
    )
  }

  static getTimelineData(paramsUrl) {
    return axios.get(`${base_new_api_url}/timeline?${paramsUrl}`, getHeader())
  }

  static getAssetsErrorsData(paramsUrl) {
    return axios.get(`${base_new_api_url}/errors?${paramsUrl}`, getHeader())
  }

  static getAssetsActivitiesData(type, options = { count: false }) {
    return axios.get(
      `${base_new_api_url}/activities?type=${type}${
        options.count ? '&count=true' : ''
      }`,
      getHeader(),
    )
  }

  static getProfessionals() {
    return axios.get(`${base_new_api_url}/professionals`, getHeader())
  }

  static getDocuments() {
    return axios.get(`${base_new_api_url}/documents`, getHeader())
  }

  static deleteDocument(id) {
    return axios.delete(`${base_new_api_url}/documents/${id}`, getFormUrlHeader())
  }

  static addDocument(doc) {
    return axios.post(`${base_new_api_url}/documents`, doc, getMultiFormUrlHeader())
  }

  static updateDocument( doc, ID ) {
    return axios.put(`${base_new_api_url}/documents/${ID}`, doc, getMultiFormUrlHeader())
  }

  static getAddresses() {
    return axios.get(`${base_new_api_url}/address`, getHeader())
  }

  static getLawFirms() {
    return axios.get(`${base_new_api_url}/lawfirm`, getHeader())
  }

  static addLawFirm(lawFirm) {
    return axios.post(`${base_new_api_url}/lawfirm`, lawFirm, getHeader())
  }

  static addLawFirmAddress(address) {
    return axios.post(`${base_new_api_url}/lawfirm_address`, address, getHeader())
  }

  static updateLawFirmAddress(addressId, changes) {
    return axios.put(`${base_new_api_url}/lawfirm_address/${addressId}`, changes, getHeader())
  }

  static deleteLawFirmAddress(addressId) {
    return axios.delete(`${base_new_api_url}/lawfirm_address/${addressId}`, getHeader())
  }
  
  static addCompanyAddress(address) {
    return axios.post(`${base_new_api_url}/address`, address, getFormUrlHeader())
  }

  static deleteCompanyAddress(addressId) {
    return axios.delete(`${base_new_api_url}/address/${addressId}`, getFormUrlHeader())
  }

  static updateCompanyAddress(id, address) {
    return axios.put(`${base_new_api_url}/address/${id}`,address, getFormUrlHeader())
  }

  static getCompanyLawyers() {
    return axios.get(`${base_new_api_url}/companies/lawfirm`, getHeader())
  }

  static addCompanyLawyer( lawyer) {
    return axios.post(`${base_new_api_url}/lawyer`, lawyer, getFormUrlHeader())
  }

  static addCompanyLawfirm( lawyer) {
    return axios.post(`${base_new_api_url}/companies/lawfirm`, lawyer, getFormUrlHeader())
  }
  

  static deleteCompanyLawyer(companyLawyerId) {
    return axios.delete(`${base_new_api_url}/lawyer/${companyLawyerId}`, getFormUrlHeader())
  }

  static postRecordItems(data, type) {
    return axios.post(
      `${base_new_api_url}/activities/${type}`,
      data,
      getMultiFormUrlHeader(),
    )
  }

  static setRecordAsCompleted(id, data) {
    return axios.put(
      `${base_new_api_url}/activities/${id}`,
      data,
      getMultiFormUrlHeader(),
    )
  }

  static getComments(level, id) {
    return axios.get(`${base_new_api_url}/comments/${_toLower(level)}/${id}`, getHeader())
  }

  static postComment(type, id, data) {
    return axios.post(`${base_new_api_url}/comments/${_toLower(type)}/${id}`, data, getHeader())
  }

  static async setCommentToEntity(type, data) {
    return axios.post(
      `${base_new_api_url}/comments/${_toLower(type)}`,
       data,
       getFormUrlHeader() 
     )
  }

  static async updateCommentToEntity(ID, data) {
    return axios.put(
      `${base_new_api_url}/comments/${ID}`,
       data,
       getFormUrlHeader() 
     )
  }

  static async deleteComment(ID) {
    return axios.delete(`${base_new_api_url}/comments/${ID}`, getFormUrlHeader())
  }

  static getCharts(option) {
    return axios.get(`${base_new_api_url}/charts/${option}`, getHeader())
  }

  static getTransactions(companies) {
    return axios.get(`${base_new_api_url}/transactions?companies=${companies}`, getHeader())
  }

  static shareIllustration( data ) {
    return axios.post(`${base_new_api_url}/share`, data, getFormUrlHeader())
  }
}

export default PatenTrackApi
