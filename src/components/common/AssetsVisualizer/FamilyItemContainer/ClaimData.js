import React from 'react'

import useStyles from './styles'

const ClaimData = ({ data }) => {
    const classes = useStyles()

    const ClaimTree = (props) => {
        return(
            <div className={classes.filetree}>
                <ul id={`claimsTree`} className={`filetree treeview`} width="100%">
                {props.children.map( (child, index) => (
                    <li
                        key={`asset-type-${index}`}
                    >
                        <span id={`claim${index}`}>{child}</span>
                    </li>
                ))}
                </ul>
            </div>
        )
    }

    return (
        <>
        {
            Array.isArray(data)
            ?
            <ClaimTree children={data}/>
            :
            <div dangerouslySetInnerHTML={ { __html:data } } className={classes.filetree}></div>
        }
        </>
    )
}

export default ClaimData