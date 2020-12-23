import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Moment from 'moment'
import Paper from '@material-ui/core/Paper'
import Fab from '@material-ui/core/Fab'
import Button from '@material-ui/core/Button'
import { Timeline, TimelineEvent } from 'react-event-timeline'
import AddIcon from '@material-ui/icons/Add'
import CircularProgress from '@material-ui/core/CircularProgress'
import Avatar from '@material-ui/core/Avatar'
import PatenTrackApi from '../../../api/patenTrack2'
import CommentDialog from '../CommentDialog'
 
import useStyles from './styles'
import { FaChevronCircleDown } from 'react-icons/fa'

const AssetsCommentsTimeline = ({ toggleMinimize }) => {
  const classes = useStyles()
  const [ isLoadingcomments, setIsLoadingcomments ] = useState(false)
  const [ commentsData, setCommentsData ] = useState([])
  const [ isCommentDialogOpen, setIsCommentDialogOpen ] = useState(false)
  const [ editData, setEditData] = useState(null)
  const companyListLoading = useSelector(state => state.patenTrack2.companyListLoading)
  const selectedCommentsEntity = useSelector(state => state.patenTrack2.selectedCommentsEntity)
  const userProfile = useSelector(state => state.patenTrack.profile)
  
  const getAssetCommentsData = useCallback(async () => {
    if (selectedCommentsEntity) {
      if (selectedCommentsEntity) {
        setIsLoadingcomments(true)
        const { data } = await PatenTrackApi.getComments(selectedCommentsEntity.type, selectedCommentsEntity.id)
        setCommentsData(data || [])
        setIsLoadingcomments(false)
      }  
    } 
  }, [ selectedCommentsEntity ])

  useEffect(() => {
    getAssetCommentsData()
  }, [ getAssetCommentsData, selectedCommentsEntity ])

  const handleSubmitComment = () => {
    getAssetCommentsData()
  }

  const onEdit = useCallback(async (event, edit) => {
    event.preventDefault()
    setEditData(edit)
    setIsCommentDialogOpen(true)
  }, [])

  const onDelete = useCallback(async (event, comment) => {
    event.preventDefault()

    const { status } = await PatenTrackApi.deleteComment(comment.comment_id)
    if (status === 200) {
      getAssetCommentsData()
    }
  }, [])

  if (companyListLoading) return null

  const type = selectedCommentsEntity && selectedCommentsEntity.type

  return (
    <Paper className={classes.root} square>
      <div className={classes.content}>

        <FaChevronCircleDown
          className={classes.minimizeButton}
          onClick={toggleMinimize} />
        {
          !type &&
          <span className={classes.emptyEntity}>Asset not selected</span>
        }
        {
          type &&
          isLoadingcomments
            ? <CircularProgress className={classes.loader} />
            : (
              commentsData &&
              type &&
              <Timeline className={classes.timeline} lineColor={'rgb(191 191 191)'}>
                {
                  commentsData.comments ?
                    commentsData.comments.reverse().map(comment => (
                      <TimelineEvent
                        key={`comment-${comment.comment_id}`}
                        contentStyle={{ background: '#303030' }}
                        bubbleStyle={{
                          background: 'rgb(48 48 48)',
                          border: '2px solid rgb(63 81 181)',
                        }}
                        cardHeaderStyle={{ color: 'white' }}
                        title={Moment(comment.createdAt).format('l HH:mm')}
                        subtitle={`${comment.user && comment.user.first_name} ${comment.user && comment.user.last_name}`}
                        subtitleStyle={{color: 'white'}}
                      icon={comment.user.logo != '' ? <Avatar alt={`${comment.user && comment.user.first_name} ${comment.user && comment.user.last_name}`} src={comment.user.logo} className={classes.small}/> : <Avatar>{`${comment.user.first_name.substring(0,1).toUpperCase()} ${comment.user.last_name.substring(0,1).toUpperCase()}`}</Avatar>}
                      >
                        <div>{comment.comment}</div>
                        {
                          userProfile != null && userProfile.user.id == comment.user_id ? (<><Button color="primary" onClick={(event) => { onEdit(event, comment) }} size="small" >
                          Edit
                          </Button> <Button color="primary" onClick={(event) => {onDelete(event, comment)}} size="small">
                          Delete
                          </Button></>) : ''
                        }
                      </TimelineEvent>
                    )) : <div />
                }
              </Timeline>
            )
        }

        {
          selectedCommentsEntity &&
          <CommentDialog
            open={isCommentDialogOpen}
            onClose={() => setIsCommentDialogOpen(false)}
            onSubmit={handleSubmitComment}
            entity={{ type: selectedCommentsEntity.type, id: selectedCommentsEntity.id, formId: 3, editData: editData }}
          />
        }
      </div>
      {
        type && (
          <Fab
            className={classes.addCommentBtn}
            onClick={() => setIsCommentDialogOpen(true)}
            size='small'>
            <AddIcon />
          </Fab>
        )
      }
    </Paper>
  )
}

export default AssetsCommentsTimeline
