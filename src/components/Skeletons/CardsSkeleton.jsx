import React from 'react'
import Skeleton from 'react-loading-skeleton'

const CardsSkeleton = ({ cards }) => {
    return (
        Array(cards).fill(0).map((_, i) => (
            <div key={i} className='mb-[10px] h-[90px] w-full flex items-center justify-between rounded-lg px-3 bg-[#bababa]'>
                {/* <Skeleton height={80} width={1130}/> */}
                <div><Skeleton width={80} height={25} /></div>
                <div className='flex gap-3 items-center'>
                    <div className='flex flex-col items-end justify-center '>
                        <Skeleton width={150} height={12}/>
                        <Skeleton width={80} height={40} />
                    </div>
                    <div className='flex flex-col items-end justify-center '>
                        <Skeleton width={150} height={12}/>
                        <Skeleton width={80} height={40} />
                    </div>
                </div>
            </div>
        ))
    )
}

export default CardsSkeleton
