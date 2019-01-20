import shuffle from "shuffle.ts"
import * as React from "react"

import "./index.less"

import { FilterSelection } from "../../logic/quiz/types"
import { QuizUser } from "../../logic/quiz/types"
import { QuestionForm } from "../QuestionForm"
import { WrongAnswerFeedback } from "../WrongAnswerFeedback"
import { Controls } from "../Controls"
import { QuizFinished } from "../QuizFinished"

export interface QuizProps { users: Array<QuizUser> }

export interface QuizState {
    selectedFilter: FilterSelection,
    remainingUsers: Array<QuizUser>,
    currentUser: QuizUser,
    correctAnswers: number,
    answerCorrect: boolean,
    showCorrectAnswer: boolean,
    quizEnded: boolean
}

export class Quiz extends React.Component<QuizProps, QuizState> {

    constructor(props: QuizProps) {
        super(props)
        this.state = this.getQuizStartState(FilterSelection.ALL)
    }
    
    getQuizStartState = (filterSelection : FilterSelection) : QuizState => {
        const shuffledUsers = shuffle(this.props.users)

        let includedUsers: Array<QuizUser>
        if (filterSelection === FilterSelection.RND10) {
            includedUsers = shuffledUsers.slice(0, 10)
        } else {
            includedUsers = shuffledUsers
        }
        return {
            selectedFilter: filterSelection,
            remainingUsers: includedUsers,
            currentUser: includedUsers[0],
            correctAnswers: 0,
            answerCorrect: false,
            showCorrectAnswer: false,
            quizEnded: false
        }
    }

    onFilterSelected = (selection: FilterSelection) => {
        this.setState(this.getQuizStartState(selection))
    }

    isAnswerCorrect = (answer: string): boolean => {
        const lowerCaseAnswer = answer.toLowerCase()
        const correctAnswers = [
            this.state.currentUser.nickname.toLowerCase(),
            this.state.currentUser.firstName.toLowerCase()
        ]

        return (correctAnswers.indexOf(lowerCaseAnswer) >= 0)
    }

    onAnswerSubmit = (answer: string): void => {
        if (this.isAnswerCorrect(answer)) {
            if (this.state.remainingUsers.length > 1) {
                this.setState({
                    remainingUsers: this.state.remainingUsers.slice(1),
                    currentUser: this.state.remainingUsers[1],
                    correctAnswers: this.state.correctAnswers + 1,
                    answerCorrect: true
                })
            } else {
                this.setState({ quizEnded: true })
            }
        } else {
            this.setState({
                answerCorrect: false,
                showCorrectAnswer: true
            })
            setTimeout(() => {
                const allUsers = this.state.remainingUsers.slice(1)
                allUsers.push(this.state.currentUser)
                this.setState({
                    remainingUsers: allUsers,
                    currentUser: allUsers[0],
                    showCorrectAnswer: false
                })
            }, 3000)
        }
    }

    getQuestionAreaComponentToShow() {
        if (this.state.showCorrectAnswer) {
            return <WrongAnswerFeedback user={this.state.currentUser} />
        }

        return <QuestionForm user={this.state.currentUser} answerHandler={this.onAnswerSubmit} />
    }

    render() {
        if (!this.state.quizEnded) {
            return (
                <div className="Quiz">
                    <div className="QuestionContainer">
                        {this.getQuestionAreaComponentToShow()}
                    </div>
                    <div className="ControlsContainer">
                        <Controls
                            remaining={this.state.remainingUsers.length}
                            correctAnswers={this.state.correctAnswers}
                            answerCorrect={this.state.answerCorrect}
                            selectedFilter={this.state.selectedFilter}
                            filterSelectionHandler={this.onFilterSelected} />
                    </div>
                </div>
            )
        } else {
            return (
                <div className="Finished">
                    <QuizFinished />
                </div>
            )
        }
    }
}
