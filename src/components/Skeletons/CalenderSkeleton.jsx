import React from 'react'
import Skeleton from 'react-loading-skeleton'

const CalenderSkeleton = () => {
  return (
    <div className='w-full'>
        <Skeleton height={550} width={450}/>    
    </div>
  )
}

export default CalenderSkeleton
