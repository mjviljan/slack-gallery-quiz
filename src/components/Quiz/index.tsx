import './index.less'

import { QuizUser } from '../../logic/quiz/types'
import { QuestionForm } from "../QuestionForm"
import { Statistics } from "../Statistics"
import shuffle from "shuffle.ts"
import * as React from "react"

export interface QuizProps { users: Array<QuizUser> }

export interface QuizState { remainingUsers: Array<QuizUser>, correct: number }

export class Quiz extends React.Component<QuizProps, QuizState> {
    constructor(props: QuizProps) {
        super(props)
        console.log('Constructing quiz')
        this.state = {
            remainingUsers: shuffle(props.users),
            correct: 0
        }
    }

    submitAnswer = (answer : String): void => {
        this.setState({
            remainingUsers: this.state.remainingUsers.slice(1),
            correct: this.state.correct + 1
        })
    }

    render() {
        return (
            <div className="Quiz">
                <div className="QuestionContainer">
                    <QuestionForm user={this.state.remainingUsers[0]} answerHandler={this.submitAnswer} />
                </div>
                <div className="StatisticsContainer">
                    <Statistics remaining={this.state.remainingUsers.length} correct={this.state.correct} />
                </div>
            </div>
        );
    }
}
