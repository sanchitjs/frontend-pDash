import React from 'react'
import Skeleton from 'react-loading-skeleton'

const DailyReportSkeleton = ({w,h}) => {
    return (
        <div className='mx-auto w-full'>
            <Skeleton height={h}/>
        </div>
    )
}

export default DailyReportSkeleton
