import './index.less'

import { QuizUser } from '../../types/types'
import * as React from 'react'

export interface AnswerFeedbackProps {
    user: QuizUser
}

export const WrongAnswerFeedback = ({ user }: AnswerFeedbackProps) => {
    const correctAnswer =
        (user.firstName.toLowerCase() !== user.nickname.toLowerCase())
            ? `${user.firstName} (${user.nickname})`
            : user.firstName

    return (
        <div className='AnswerFeedback'>
            <img src={user.imageUrl}  alt="Picture of the doggo"/>
            <div className='Question'>Not quite.</div>
            <div className='CorrectAnswer'>{correctAnswer}</div>
        </div>
    )
}
