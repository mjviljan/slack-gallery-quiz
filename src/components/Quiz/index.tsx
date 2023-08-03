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
    nextUserImgUrl: string
    correctAnswers: number
    userImageLoaded: boolean
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
        const storedFailures = window.localStorage.getItem('failedGuesses')
        const previousFailures: string[] = storedFailures ? JSON.parse(storedFailures) : []

        let includedUsers: Array<QuizUser>
        if (filterSelection === FilterSelection.NEWEST10 || filterSelection === FilterSelection.NEWEST25) {
            const allUsers = [...this.props.users]
            const groupSize = (filterSelection === FilterSelection.NEWEST10 ? 10 : 25)
            const newestBatch = allUsers.splice(allUsers.length - groupSize)
            includedUsers = shuffle(newestBatch)
        } else {
            const shuffledUsers = shuffle(this.props.users)
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
        }
        return {
            selectedFilter: filterSelection,
            remainingUsers: includedUsers,
            currentUser: includedUsers[0],
            nextUserImgUrl: includedUsers.length > 1 ? includedUsers[1].imageUrl : '',
            correctAnswers: 0,
            userImageLoaded: false,
            showCorrectAnswer: false,
            failedGuessUsers: [],
            previousFailures: previousFailures,
            quizEnded: false,
        }
    }

    onFilterSelected = (selection: FilterSelection) => {
        this.setState(this.getQuizStartState(selection))
    }

    onUserImageLoaded = () => {
        this.setState({ userImageLoaded: true })
    }

    restartWithFailedGuessed = () => {
        this.setState(this.getQuizStartState(FilterSelection.FAILURES))
    }

    separateNameOptions = (combined: string): string[] => {
        if (combined.indexOf("/") >= 0) {
            return combined.split("/").map(s => s.trim())
        }

        return []
    }

    normalizeString = (orig: string): string => {
        const lowerCase = orig.toLowerCase()
        return lowerCase
            .replace(/[áàäâǎãåa̧]/g, "a")
            .replace(/[éèëêěȩȩḝ]/g, "e")
            .replace(/[íìïîǐi̧]/g, "i")
            .replace(/[óòöôǒõo̧]/g, "o")
            .replace(/[úùüûǔu̧]/g, "u")
            .replace(/[ÿy̌]/g, "y")

            .replace(/[b̌b]̧ /g, "b")
            .replace(/[čçḉ]/g, "c")
            .replace(/[ďḑ]/g, "d")
            .replace(/f̌/g, "f")
            .replace(/[ǧģ]/g, "g")
            .replace(/[ȟḩ]/g, "h")
            .replace(/ǰ/g, "j")
            .replace(/[ǩķ]/g, "k")
            .replace(/[ľļ]/g, "l")
            .replace(/[m̌m̧]/g, "m")
            .replace(/[ňñņ]/g, "n")
            .replace(/p̌/g, "p")
            .replace(/[q̌q̧]/g, "q")
            .replace(/[řŗ]/g, "r")
            .replace(/[šş]/g, "s")
            .replace(/[ťţ]/g, "t")
            .replace(/v̌/g, "v")
            .replace(/w̌/g, "w")
            .replace(/[x̌x̧]/g, "x")
            .replace(/[žz̧]/g, "z")
    }

    isAnswerCorrect = (answer: string): boolean => {
        const normalizedAnswer = this.normalizeString(answer)
        const correctAnswers = [
            this.state.currentUser.nickname,
            this.state.currentUser.firstName,
            ...this.separateNameOptions(this.state.currentUser.nickname)
        ].map(ca => this.normalizeString(ca))

        return correctAnswers.indexOf(normalizedAnswer) >= 0
    }

    onAnswerSubmit = (answer: string): void => {
        this.setState({
            nextUserImgUrl: this.state.remainingUsers.length > 2 ? this.state.remainingUsers[2].imageUrl : '',
            userImageLoaded: false
        })
        if (this.isAnswerCorrect(answer)) {
            if (this.state.remainingUsers.length > 1) {
                this.setState({
                    remainingUsers: this.state.remainingUsers.slice(1),
                    currentUser: this.state.remainingUsers[1],
                    correctAnswers: this.state.correctAnswers + 1,
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
            return <WrongAnswerFeedback user={this.state.currentUser}/>
        }

        return <QuestionForm
            user={this.state.currentUser}
            answerHandler={this.onAnswerSubmit}
            userImageLoaded={this.state.userImageLoaded}
            imageOnloadHandler={this.onUserImageLoaded}/>
    }

    getNextImagePreloadComponent() {
        if (this.state.nextUserImgUrl) {
            return <link rel="prefetch" href={this.state.nextUserImgUrl}/>
        }

        // just return a "no-op" component
        return <a />
    }

    render() {
        if (!this.state.quizEnded) {
            return (
                <div className="Quiz">
                    {this.getNextImagePreloadComponent()}
                    <div className="QuestionContainer">{this.getQuestionAreaComponentToShow()}</div>
                    <div className="ControlsContainer">
                        <Controls
                            remaining={this.state.remainingUsers.length}
                            correctAnswers={this.state.correctAnswers}
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
