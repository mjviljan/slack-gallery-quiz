import './index.less'

import * as React from 'react'
import { QuizUser } from '../../types/types'

export interface ImageLoaderProps {
    userImageUrl: string
    imageOnloadHandler: () => void
}

export class ImageLoader extends React.Component<ImageLoaderProps, {}> {
    render() {
        return (
            <div className="ImageLoader">
                <div className="Circle">
                    <div className="Hub"/>
                    <div className="ShortArm"/>
                    <div className="LongArm"/>
                </div>
                <div className="Text">
                    <p>Loading</p>
                </div>
                <img className="ImageBeingLoaded" src={this.props.userImageUrl} onLoad={this.props.imageOnloadHandler}/>
            </div>
        )
    }
}
