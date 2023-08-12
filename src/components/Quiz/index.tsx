import shuffle from 'shuffle.ts'
import * as React from 'react'
import { useEffect, useState } from 'react'

import './index.less'

import { FilterSelection, QuizUser } from '../../types/types'
import { QuestionForm } from '../QuestionForm'
import { WrongAnswerFeedback } from '../WrongAnswerFeedback'
import { Controls } from '../Controls'
import { QuizFinished } from '../QuizFinished'

export interface QuizProps {
    users: Array<QuizUser>
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

export const Quiz = ({ users }: QuizProps) => {
    const [quizEnded, setQuizEnded] = useState(false)
    const [userImageLoaded, setUserImageLoaded] = useState(false)
    const [showCorrectAnswer, setShowCorrectAnswer] = useState(false)
    const [correctAnswerCount, setCorrectAnswerCount] = useState(0)
    const [selectedFilter, setSelectedFilter] = useState(FilterSelection.ALL)
    const [remainingUsers, setRemainingUsers] = useState(new Array<QuizUser>)
    const [failedGuessUsers, setFailedGuessUsers] = useState(new Array<string>)
    const [previousFailures, setPreviousFailures] = useState(new Array<string>)
    const [currentUser, setCurrentUser] = useState(remainingUsers[0])

    const startNewQuiz = (users: Array<QuizUser>, filterSelection: FilterSelection, failedGuessUsers: Array<String>) => {
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

        setRemainingUsers(includedUsers)
        setFailedGuessUsers([])
        setPreviousFailures(previousFailures)
        setCurrentUser(includedUsers[0])
    }

    useEffect(() => startNewQuiz(users, selectedFilter, []), [users])

    const [nextUserImgUrl, setNextUserImgUrl] = useState<string | undefined>(remainingUsers.length > 1 ? remainingUsers[1].imageUrl : undefined)

    const onFilterSelected = (selection: FilterSelection) => {
        setSelectedFilter(selection)
        startNewQuiz(users, selection, failedGuessUsers)
    }

    const onUserImageLoaded = () => {
        setUserImageLoaded(true)
    }

    const restartWithFailedGuessed = () => {
        startNewQuiz(users, FilterSelection.FAILURES, failedGuessUsers)
        setQuizEnded(false)
    }

    const isAnswerCorrect = (answer: string): boolean => {
        const normalizedAnswer = normalizeString(answer)
        const correctAnswers = [
            currentUser.nickname,
            currentUser.firstName,
            ...separateNameOptions(currentUser.nickname),
        ].map(ca => normalizeString(ca))

        return correctAnswers.indexOf(normalizedAnswer) >= 0
    }

    const onAnswerSubmit = (answer: string): void => {
        setUserImageLoaded(false)
        setNextUserImgUrl(remainingUsers.length > 2 ? remainingUsers[2].imageUrl : undefined)
        if (isAnswerCorrect(answer)) {
            if (remainingUsers.length > 1) {
                setRemainingUsers(remainingUsers.slice(1))
                setCurrentUser(remainingUsers[1])
                setCorrectAnswerCount(correctAnswerCount + 1)
            } else {
                setQuizEnded(true)
            }
        } else {
            const failedGuesses = failedGuessUsers
            const currentUserId = currentUser.id
            if (failedGuesses.indexOf(currentUserId) === -1) {
                failedGuesses.push(currentUserId)
            }
            setFailedGuessUsers(failedGuesses)
            setShowCorrectAnswer(true)
            setTimeout(() => {
                const allUsers = remainingUsers.slice(1)
                allUsers.push(currentUser)
                setRemainingUsers(allUsers)
                setCurrentUser(allUsers[0])
                setShowCorrectAnswer(false)
            }, 3000)
        }
    }

    const getQuestionAreaComponentToShow = () => {
        return (currentUser) ?
            (showCorrectAnswer)
                ? <WrongAnswerFeedback user={currentUser} />
                : <QuestionForm
                    user={currentUser}
                    answerHandler={onAnswerSubmit}
                    userImageLoaded={userImageLoaded}
                    imageOnloadHandler={onUserImageLoaded} />
            : <></>
    }

    const getNextImagePreloadComponent = () => {
        if (nextUserImgUrl) {
            return <link rel='prefetch' href={nextUserImgUrl} />
        }

        return null
    }

    if (quizEnded) {
        window.localStorage.setItem('failedGuesses', JSON.stringify(failedGuessUsers))
        return (
            <div className='Finished'>
                <QuizFinished
                    restartFunction={failedGuessUsers.length > 0 ? restartWithFailedGuessed : null}
                />
            </div>
        )
    } else {
        return (
            <div className='Quiz'>
                {getNextImagePreloadComponent()}
                <div className='QuestionContainer'>{getQuestionAreaComponentToShow()}</div>
                <div className='ControlsContainer'>
                    <Controls
                        remaining={remainingUsers.length}
                        correctAnswers={correctAnswerCount}
                        showFailedGuessesOption={
                            failedGuessUsers.length > 0 || previousFailures.length > 0
                        }
                        selectedFilter={selectedFilter}
                        filterSelectionHandler={onFilterSelected}
                    />
                </div>
            </div>
        )
    }
}
