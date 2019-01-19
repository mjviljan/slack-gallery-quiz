import './index.less'

import { QuizUser } from '../../logic/quiz/types'
import { QuestionForm } from "../QuestionForm"
import { Statistics } from "../Statistics"
import shuffle from "shuffle.ts"
import * as React from "react"

export class QuizFinished extends React.Component<{}, {}> {
    render() {
        return (
            <div className="QuizFinished">
                <div className="Congratulations">
                    <div className="TextRow">
                        <div className="WiggleLetterCW">G</div>
                        <div className="WiggleLetterCCW">o</div>
                        <div className="WiggleLetterCW">o</div>
                        <div className="WiggleLetterCCW">d</div>
                    </div>
                    <div className="TextRow">
                        <div className="WiggleLetterCW">j</div>
                        <div className="WiggleLetterCCW">o</div>
                        <div className="WiggleLetterCW">b</div>
                        <div className="WiggleLetterCCW">!</div>
                    </div>
                </div>
            </div>
        )
    }
}
