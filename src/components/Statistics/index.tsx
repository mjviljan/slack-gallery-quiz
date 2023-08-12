import './index.less'

import * as React from 'react'
import { useEffect, useRef } from 'react'

export interface StatisticsProps {
    remaining: number
    correctAnswers: number
}

export const Statistics = ({ remaining, correctAnswers }: StatisticsProps) => {
    const correctMarker = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const markerElement = correctMarker.current
        if (markerElement && correctAnswers) {
            markerElement.classList.remove('Flash')
            // force re-triggering the CSS animation
            void markerElement.offsetWidth
            markerElement.classList.add('Flash')
        }
    }, [correctAnswers])

    return (
        <div className='Statistics'>
            <div className='Remaining'>
                <div className='Label'>🐶</div>
                <div className='Value'>{remaining}</div>
            </div>
            <div className='Correct'>
                <div className='Label' ref={correctMarker}>
                    ✓
                </div>
                <div className='Value'>{correctAnswers}</div>
            </div>
        </div>
    )
}
