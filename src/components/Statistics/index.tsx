import './index.less'

import { QuizUser } from '../../logic/quiz/types'
import shuffle from "shuffle.ts"
import * as React from "react"

export interface StatisticsContainerProps { remaining: number, correct: number }

export class Statistics extends React.Component<StatisticsContainerProps, {}> {
    render() {
        return (
            <div className="Statistics">
                <div className="Remaining">
                    <div className="Label">🐶</div>
                    <div className="Value">{this.props.remaining}</div>
                </div>
                <div className="Correct">
                    <div className="Label">✓</div>
                    <div className="Value">{this.props.correct}</div>
                </div>
            </div>
        )
    }
}
