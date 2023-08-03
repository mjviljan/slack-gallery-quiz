import shuffle from 'shuffle.ts'
import * as React from 'react'
import { useState } from 'react'

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

const getQuizStartState = (users: Array<QuizUser>, filterSelection: FilterSelection, failedGuessUsers: Array<String>): QuizState => {
    const storedFailures = window.localStorage.getItem('failedGuesses')
    const previousFailures: string[] = storedFailures ? JSON.parse(storedFailures) : []

    let includedUsers: Array<QuizUser>
    if (filterSelection === FilterSelection.NEWEST10 || filterSelection === FilterSelection.NEWEST25) {
        const allUsers = [...users]
        const groupSize = (filterSelection === FilterSelection.NEWEST10 ? 10 : 25)
        const newestBatch = allUsers.splice(allUsers.length - groupSize)
        includedUsers = shuffle(newestBatch)
    } else {
        const shuffledUsers = shuffle(users)
        if (filterSelection === FilterSelection.RND10) {
            includedUsers = shuffledUsers.slice(0, 10)
        } else if (filterSelection === FilterSelection.FAILURES) {
            if (previousFailures.length > 0) {
                includedUsers = shuffledUsers.filter(u => previousFailures.indexOf(u.id) >= 0)
            } else {
                includedUsers = shuffledUsers.filter(u => failedGuessUsers.indexOf(u.id) >= 0)
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

export const Quiz = ({ users }: QuizProps) => {
    const [quizState, setQuizState] = useState<QuizState>(getQuizStartState(users, FilterSelection.ALL, []))

    const onFilterSelected = (selection: FilterSelection) => {
        setQuizState(prevState => ({ ...prevState, ...getQuizStartState(users, selection, quizState.failedGuessUsers) }))
    }

    const onUserImageLoaded = () => {
        setQuizState(prevState => ({ ...prevState, userImageLoaded: true }))
    }

    const restartWithFailedGuessed = () => {
        setQuizState(prevState => ({ ...prevState, ...getQuizStartState(users, FilterSelection.FAILURES, quizState.failedGuessUsers) }))
    }

    const separateNameOptions = (combined: string): string[] => {
        if (combined.indexOf('/') >= 0) {
            return combined.split('/').map(s => s.trim())
        }

        return []
    }

    const normalizeString = (orig: string): string => {
        const lowerCase = orig.toLowerCase()
        return lowerCase
            .replace(/[áàäâǎãåa̧]/g, 'a')
            .replace(/[éèëêěȩȩḝ]/g, 'e')
            .replace(/[íìïîǐi̧]/g, 'i')
            .replace(/[óòöôǒõo̧]/g, 'o')
            .replace(/[úùüûǔu̧]/g, 'u')
            .replace(/[ÿy̌]/g, 'y')

            .replace(/[b̌b]̧ /g, 'b')
            .replace(/[čçḉ]/g, 'c')
            .replace(/[ďḑ]/g, 'd')
            .replace(/f̌/g, 'f')
            .replace(/[ǧģ]/g, 'g')
            .replace(/[ȟḩ]/g, 'h')
            .replace(/ǰ/g, 'j')
            .replace(/[ǩķ]/g, 'k')
            .replace(/[ľļ]/g, 'l')
            .replace(/[m̌m̧]/g, 'm')
            .replace(/[ňñņ]/g, 'n')
            .replace(/p̌/g, 'p')
            .replace(/[q̌q̧]/g, 'q')
            .replace(/[řŗ]/g, 'r')
            .replace(/[šş]/g, 's')
            .replace(/[ťţ]/g, 't')
            .replace(/v̌/g, 'v')
            .replace(/w̌/g, 'w')
            .replace(/[x̌x̧]/g, 'x')
            .replace(/[žz̧]/g, 'z')
    }

    const isAnswerCorrect = (answer: string): boolean => {
        const normalizedAnswer = normalizeString(answer)
        const correctAnswers = [
            quizState.currentUser.nickname,
            quizState.currentUser.firstName,
            ...separateNameOptions(quizState.currentUser.nickname),
        ].map(ca => normalizeString(ca))

        return correctAnswers.indexOf(normalizedAnswer) >= 0
    }

    const onAnswerSubmit = (answer: string): void => {
        setQuizState(prevState => ({
            ...prevState,
            nextUserImgUrl: quizState.remainingUsers.length > 2 ? quizState.remainingUsers[2].imageUrl : '',
            userImageLoaded: false,
        }))
        if (isAnswerCorrect(answer)) {
            if (quizState.remainingUsers.length > 1) {
                setQuizState(prevState => ({
                    ...prevState,
                    remainingUsers: quizState.remainingUsers.slice(1),
                    currentUser: quizState.remainingUsers[1],
                    correctAnswers: quizState.correctAnswers + 1,
                }))
            } else {
                setQuizState(prevState => ({ ...prevState, quizEnded: true }))
            }
        } else {
            const failedGuesses = quizState.failedGuessUsers
            const currentUserId = quizState.currentUser.id
            if (failedGuesses.indexOf(currentUserId) === -1) {
                failedGuesses.push(currentUserId)
            }
            setQuizState(prevState => ({
                ...prevState,
                showCorrectAnswer: true,
                failedGuessUsers: failedGuesses,
            }))
            setTimeout(() => {
                const allUsers = quizState.remainingUsers.slice(1)
                allUsers.push(quizState.currentUser)
                setQuizState(prevState => ({
                    ...prevState,
                    remainingUsers: allUsers,
                    currentUser: allUsers[0],
                    showCorrectAnswer: false,
                }))
            }, 3000)
        }
    }

    const getQuestionAreaComponentToShow = () => {
        if (quizState.showCorrectAnswer) {
            return <WrongAnswerFeedback user={quizState.currentUser} />
        }

        return <QuestionForm
            user={quizState.currentUser}
            answerHandler={onAnswerSubmit}
            userImageLoaded={quizState.userImageLoaded}
            imageOnloadHandler={onUserImageLoaded} />
    }

    const getNextImagePreloadComponent = () => {
        if (quizState.nextUserImgUrl) {
            return <link rel='prefetch' href={quizState.nextUserImgUrl} />
        }

        // just return a "no-op" component
        return <a />
    }

    if (!quizState.quizEnded) {
        return (
            <div className='Quiz'>
                {getNextImagePreloadComponent()}
                <div className='QuestionContainer'>{getQuestionAreaComponentToShow()}</div>
                <div className='ControlsContainer'>
                    <Controls
                        remaining={quizState.remainingUsers.length}
                        correctAnswers={quizState.correctAnswers}
                        showFailedGuessesOption={
                            quizState.failedGuessUsers.length > 0 || quizState.previousFailures.length > 0
                        }
                        selectedFilter={quizState.selectedFilter}
                        filterSelectionHandler={onFilterSelected}
                    />
                </div>
            </div>
        )
    } else {
        window.localStorage.setItem('failedGuesses', JSON.stringify(quizState.failedGuessUsers))
        return (
            <div className='Finished'>
                <QuizFinished
                    restartFunction={quizState.failedGuessUsers.length > 0 ? restartWithFailedGuessed : null}
                />
            </div>
        )
    }
}
