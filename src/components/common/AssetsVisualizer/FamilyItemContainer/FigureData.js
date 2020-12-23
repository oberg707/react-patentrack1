import React, { useCallback } from 'react'

import Paper from '@material-ui/core/Paper'

const FigureData = ( { data } ) => {
    return (
        <>
        {
            data != null && data.length > 0 
            ?
                <embed src={data[0]+ '#toolbar=0&amp;navpanes=0&amp;scrollbar=0&quot;'} class="tool_open" type="application/pdf"></embed>
            :
            ''
        }
        </>
    )
}

export default FigureData