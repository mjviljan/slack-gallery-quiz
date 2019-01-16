import './index.less'

import { QuizUser } from '../../logic/quiz/types'
import { QuestionForm } from "../QuestionForm"
import { Statistics } from "../Statistics"
import shuffle from "shuffle.ts"
import * as React from "react"

export interface QuizProps { users: Array<QuizUser> }

export interface QuizState { remainingUsers: Array<QuizUser>, currentUser: QuizUser, correct: number }

export class Quiz extends React.Component<QuizProps, QuizState> {
    constructor(props: QuizProps) {
        super(props)
        const shuffledUsers = shuffle(props.users)
        this.state = {
            remainingUsers: shuffledUsers,
            currentUser: shuffledUsers[0],
            correct: 0
        }
    }

    submitAnswer = (answer : String): void => {
        const lowerCaseAnswer = answer.toLowerCase()
        const correctAnswers = [
            this.state.currentUser.nickname.toLowerCase(),
            this.state.currentUser.firstName.toLowerCase()
        ]

        if (correctAnswers.indexOf(lowerCaseAnswer) >= 0) {
            console.log('Correct answer!')
            this.setState({
                remainingUsers: this.state.remainingUsers.slice(1),
                currentUser: this.state.remainingUsers[1],
                correct: this.state.correct + 1
            })
        } else {
            console.log('Wrong answer :(')
            const allUsers = this.state.remainingUsers.slice(1)
            allUsers.push(this.state.currentUser)
            this.setState({
                remainingUsers: allUsers,
                currentUser: allUsers[0]
            })
        }
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
