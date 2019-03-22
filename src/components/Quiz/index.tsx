import shuffle from 'shuffle.ts'
import * as React from 'react'

import './index.less'

import { FilterSelection, QuizUser } from '../../types/types'
import { QuestionForm } from '../QuestionForm'
import { WrongAnswerFeedback } from '../WrongAnswerFeedback'
import { Controls } from '../Controls'
import { QuizFinished } from '../QuizFinished'

export interface QuizProps {
    users: Array<QuizUser>
}

export interface QuizState {
    selectedFilter: FilterSelection
    remainingUsers: Array<QuizUser>
    currentUser: QuizUser
    correctAnswers: number
    answerCorrect: boolean
    showCorrectAnswer: boolean
    failedGuessUsers: Array<string>
    previousFailures: Array<string>
    quizEnded: boolean
}

export class Quiz extends React.Component<QuizProps, QuizState> {
    constructor(props: QuizProps) {
        super(props)
        this.state = this.getQuizStartState(FilterSelection.ALL)
    }

    getQuizStartState = (filterSelection: FilterSelection): QuizState => {
        const shuffledUsers = shuffle(this.props.users)
        const storedFailures = window.localStorage.getItem('failedGuesses')
        const previousFailures: string[] = storedFailures ? JSON.parse(storedFailures) : []

        let includedUsers: Array<QuizUser>
        if (filterSelection === FilterSelection.RND10) {
            includedUsers = shuffledUsers.slice(0, 10)
        } else if (filterSelection === FilterSelection.FAILURES) {
            if (previousFailures.length > 0) {
                includedUsers = shuffledUsers.filter(u => previousFailures.indexOf(u.id) >= 0)
            } else {
                includedUsers = shuffledUsers.filter(u => this.state.failedGuessUsers.indexOf(u.id) >= 0)
            }
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
            failedGuessUsers: [],
            previousFailures: previousFailures,
            quizEnded: false,
        }
    }

    onFilterSelected = (selection: FilterSelection) => {
        this.setState(this.getQuizStartState(selection))
    }

    restartWithFailedGuessed = () => {
        this.setState(this.getQuizStartState(FilterSelection.FAILURES))
    }

    isAnswerCorrect = (answer: string): boolean => {
        const lowerCaseAnswer = answer.toLowerCase()
        const correctAnswers = [
            this.state.currentUser.nickname.toLowerCase(),
            this.state.currentUser.firstName.toLowerCase(),
        ]

        return correctAnswers.indexOf(lowerCaseAnswer) >= 0
    }

    onAnswerSubmit = (answer: string): void => {
        if (this.isAnswerCorrect(answer)) {
            if (this.state.remainingUsers.length > 1) {
                this.setState({
                    remainingUsers: this.state.remainingUsers.slice(1),
                    currentUser: this.state.remainingUsers[1],
                    correctAnswers: this.state.correctAnswers + 1,
                    answerCorrect: true,
                })
            } else {
                this.setState({ quizEnded: true })
            }
        } else {
            const failedGuesses = this.state.failedGuessUsers
            const currentUserId = this.state.currentUser.id
            if (failedGuesses.indexOf(currentUserId) === -1) {
                failedGuesses.push(currentUserId)
            }
            this.setState({
                answerCorrect: false,
                showCorrectAnswer: true,
                failedGuessUsers: failedGuesses,
            })
            setTimeout(() => {
                const allUsers = this.state.remainingUsers.slice(1)
                allUsers.push(this.state.currentUser)
                this.setState({
                    remainingUsers: allUsers,
                    currentUser: allUsers[0],
                    showCorrectAnswer: false,
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
                    <div className="QuestionContainer">{this.getQuestionAreaComponentToShow()}</div>
                    <div className="ControlsContainer">
                        <Controls
                            remaining={this.state.remainingUsers.length}
                            correctAnswers={this.state.correctAnswers}
                            answerCorrect={this.state.answerCorrect}
                            showFailedGuessesOption={
                                this.state.failedGuessUsers.length > 0 || this.state.previousFailures.length > 0
                            }
                            selectedFilter={this.state.selectedFilter}
                            filterSelectionHandler={this.onFilterSelected}
                        />
                    </div>
                </div>
            )
        } else {
            window.localStorage.setItem('failedGuesses', JSON.stringify(this.state.failedGuessUsers))
            return (
                <div className="Finished">
                    <QuizFinished
                        restartFunction={this.state.failedGuessUsers.length > 0 ? this.restartWithFailedGuessed : null}
                    />
                </div>
            )
        }
    }
}
