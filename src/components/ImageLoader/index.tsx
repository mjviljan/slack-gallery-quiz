import './index.less'

import * as React from 'react'

export interface ImageLoaderProps {
    userImageUrl: string
    imageOnloadHandler: () => void
}

export const ImageLoader = ({ userImageUrl, imageOnloadHandler }: ImageLoaderProps) =>
    (
        <div className='ImageLoader'>
            <div className='Circle'>
                <div className='Hub' />
                <div className='ShortArm' />
                <div className='LongArm' />
            </div>
            <div className='Text'>
                <p>Loading</p>
            </div>
            <img className='ImageBeingLoaded' src={userImageUrl} onLoad={imageOnloadHandler}
                 alt="Hidden placeholder for doggo's picture" />
        </div>
    )
