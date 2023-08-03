import './index.less'

import { QuizUser } from '../../types/types'
import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { ImageLoader } from '../ImageLoader'

export interface QuestionFormProps {
    user: QuizUser
    answerHandler: (answer: string) => void
    userImageLoaded: boolean
    imageOnloadHandler: () => void
}

export const QuestionForm = ({ user, answerHandler, userImageLoaded, imageOnloadHandler }: QuestionFormProps) => {
    const [guess, setGuess] = useState('')
    const answerField = useRef<HTMLInputElement>(null)

    const handleGuessChange = (event: React.FormEvent<HTMLInputElement>) => {
        setGuess(event.currentTarget.value)
    }

    const submitAnswer = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        answerHandler(guess)

        setGuess('')
    }

    const setFocusToAnswerField = () => {
        const field = answerField.current
        if (field) {
            field.focus()
        }
    }

    useEffect(() => {
        setFocusToAnswerField()
    })

    return userImageLoaded
        ? (
            <div className='QuestionForm'>
                <img src={user.imageUrl} alt='Picture of a doggo' />
                <div className='Question'>Who is this?</div>
                <form onSubmit={submitAnswer}>
                    <input
                        ref={answerField}
                        type='text'
                        value={guess}
                        onChange={handleGuessChange}
                    />
                </form>
            </div>
        )
        : <ImageLoader userImageUrl={user.imageUrl}
                       imageOnloadHandler={imageOnloadHandler} />
}
