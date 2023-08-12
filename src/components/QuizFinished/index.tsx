import './index.less'
import * as React from 'react'

export interface QuizFinishedProps {
    restartFunction: (() => void) | null
}

export const QuizFinished = ({ restartFunction }: QuizFinishedProps) => {
    const onRestartClicked = (clickEvent: React.MouseEvent) => {
        clickEvent.preventDefault()

        if (restartFunction) {
            restartFunction()
        }
    }

    return (
        <div className='QuizFinished'>
            <div className='RingOfStars'>
                <div className='Star Star-1'>★</div>
                <div className='Star Star-2'>★</div>
                <div className='Star Star-3'>★</div>
                <div className='Star Star-4'>★</div>
                <div className='Star Star-5'>★</div>
                <div className='Star Star-6'>★</div>
                <div className='Star Star-7'>★</div>
                <div className='Star Star-8'>★</div>
                <div className='Star Star-9'>★</div>
                <div className='Star Star-10'>★</div>
                <div className='Star Star-11'>★</div>
                <div className='Star Star-12'>★</div>
            </div>
            <div className='Congratulations'>
                <div className='TextRow'>
                    <div className='WiggleLetterCW'>G</div>
                    <div className='WiggleLetterCCW'>o</div>
                    <div className='WiggleLetterCW'>o</div>
                    <div className='WiggleLetterCCW'>d</div>
                </div>
                <div className='TextRow'>
                    <div className='WiggleLetterCW'>j</div>
                    <div className='WiggleLetterCCW'>o</div>
                    <div className='WiggleLetterCW'>b</div>
                    <div className='WiggleLetterCCW'>!</div>
                </div>
            </div>
            <div className={restartFunction ? 'RestartLink' : 'Hidden'}>
                <a href='#' onClick={onRestartClicked}>
                    Restart quiz with failed guesses only ↺
                </a>
            </div>
        </div>
    )
}
