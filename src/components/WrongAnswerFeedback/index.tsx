import './index.less'

import { QuizUser } from '../../types/types'
import * as React from 'react'

export interface AnswerFeedbackProps {
    user: QuizUser
}

export class WrongAnswerFeedback extends React.Component<AnswerFeedbackProps, {}> {
    render() {
        let correctAnswer = this.props.user.firstName
        if (this.props.user.firstName.toLowerCase() !== this.props.user.nickname.toLowerCase()) {
            correctAnswer += ` (${this.props.user.nickname})`
        }
        return (
            <div className="AnswerFeedback">
                <img src={this.props.user.imageUrl} />
                <div className="Question">Not quite.</div>
                <div className="CorrectAnswer">{correctAnswer}</div>
            </div>
        )
    }
}
