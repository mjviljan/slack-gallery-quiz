import './index.less'

import { QuizUser } from '../../logic/quiz/types'
import shuffle from "shuffle.ts"
import * as React from "react"

export interface StatisticsContainerProps { remaining: number, correct: number }

export class Statistics extends React.Component<StatisticsContainerProps, {}> {
    render() {
        return (
            <div className="Statistics">
                <div className="Remaining">🐶 {this.props.remaining}</div>
                <div className="Correct">✓ {this.props.correct}</div>
            </div>
        );
    }
}
