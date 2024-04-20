import React from 'react'
import Skeleton from 'react-loading-skeleton'

const TopBar = ({height}) => {
  return (
    <div className='w-full mb-2'>
        <Skeleton height={height} />              
    </div>
  )
}

export default TopBar
