import React, { useState, useCallback, useEffect, useRef } from 'react'

import { useSelector } from 'react-redux'
import { Tab, Tabs, Paper, Grid } from '@material-ui/core'

import LegalEventsContainer from '../LegalEventsContainer'
import ItemData from './ItemData'
import AbstractData from './AbstractData'
import ClaimData from './ClaimData'
import FigureData from './FigureData'
import AssignmentData from './AssignmentData'


import useStyles from './styles'

const FamilyItemContainer = ({ item, onClose }) => {

    const classes = useStyles()
    const [ selectedTab, setSelectedTab ] = useState(0)
    const [ familyItemData, setfamilyItemData ] = useState({})
    const [ abstractData, setAbsractData ] = useState('')
    const [ claimsData, setClaimsData ] = useState('')
    const [ figureData, setFigureData ] = useState([])
    const [ assignmentsData, setAssignmentsData ] = useState([])
    const handleChangeTab = (event, newTab) => setSelectedTab(newTab)
    const selectedAssetsLegalEvents = useSelector(state => state.patenTrack.assetLegalEvents)
    useEffect(() => {
        if(Object.keys(item).length === 0) return setfamilyItemData({})

        const getFamuliyItemDataFunction = async () => {
            setfamilyItemData({
                inventors: item.inventors,
                applicants: item.applicants,
                assignee: item.assignee,
                priority_date: item.priority_date,
                patent_number: item.patent_number,
                application_date: item.application_date,
                publication_date: item.publication_date,
                application_number: item.application_number,                
                publication_country: item.publication_country,
                publication_kind: item.publication_kind
            })
            setAbsractData(item.abstracts)
            setClaimsData(item.claims)
            try{
               
                setFigureData(JSON.parse(item.images))                
                setAssignmentsData(JSON.parse(item.assigments))
            } catch( err) {
                console.log(err)
            }
        }
        getFamuliyItemDataFunction()
    }, [ item ])

    return(
        <Paper className={classes.root} square>
            {familyItemData != '' && familyItemData.title != undefined ? `<span>${familyItemData.publication_country}${familyItemData.patent_number != '' ? familyItemData.patent_number : familyItemData.application_number}${familyItemData.patent_number != '' ? familyItemData.publication_kind : familyItemData.application_kind}</span>` : ''} 
            <Tabs className={classes.tabs} variant={'scrollable'} value={selectedTab} onChange={handleChangeTab}>
                {/* <Tab
                className={classes.tab}
                label={'Data'}
                /> */}
                <Tab
                className={classes.tab}
                label={'Events'}
                />
                <Tab
                className={classes.tab}
                label={'Abstract'}
                />
                <Tab
                className={classes.tab}
                label={'Claim'}
                />
                <Tab
                className={classes.tab}
                label={'Assignments'}
                />
                <Tab
                className={classes.tab}
                label={'Figure'}
                />
            </Tabs>
            {selectedTab === 0 && <LegalEventsContainer events={selectedAssetsLegalEvents} />}
            <Grid container className={classes.dashboard}>
                <Grid
                item
                lg={12}
                md={12}
                sm={12}
                xs={12}
                className={classes.flexColumn}
                >   
                    {/* {selectedTab === 0 && <ItemData data={familyItemData} />} */}
                    {selectedTab === 1 && <AbstractData data={abstractData} />}
                    {selectedTab === 2 && <ClaimData data={claimsData} />}
                    {selectedTab === 3 && <FigureData data={figureData} />}
                    {selectedTab === 4 && <AssignmentData data={assignmentsData} />}
                </Grid> 
            </Grid>
            
        </Paper>
    )
}


export default FamilyItemContainer