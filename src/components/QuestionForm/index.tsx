import './index.less'

import { QuizUser } from '../../types/types'
import * as React from 'react'
import { ImageLoader } from '../ImageLoader'

export interface QuestionFormProps {
    user: QuizUser
    answerHandler: (answer: string) => void
    userImageLoaded: boolean
    imageOnloadHandler: () => void
}

export class QuestionForm extends React.Component<QuestionFormProps, { guess: string }> {
    _answerField: React.RefObject<HTMLInputElement>

    constructor(props: QuestionFormProps) {
        super(props)
        this.state = { guess: '' }
        this._answerField = React.createRef()
    }

    handleGuessChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({ guess: event.currentTarget.value })
    }

    submitAnswer = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        this.props.answerHandler(this.state.guess)

        this.setState({ guess: '' })
    }

    setFocusToAnswerField = () => {
        const answerField = this._answerField.current
        if (answerField) {
            answerField.focus()
        }
    }

    componentDidMount() {
        this.setFocusToAnswerField()
    }

    componentDidUpdate() {
        this.setFocusToAnswerField()
    }

    render() {
        if (this.props.userImageLoaded) {
            return (
                <div className="QuestionForm">
                    <img src={this.props.user.imageUrl}/>
                    <div className="Question">Who is this?</div>
                    <form onSubmit={this.submitAnswer}>
                        <input
                            ref={this._answerField}
                            type="text"
                            value={this.state.guess}
                            onChange={this.handleGuessChange}
                        />
                    </form>
                </div>
            )
        } else {
            return <ImageLoader userImageUrl={this.props.user.imageUrl}
                                imageOnloadHandler={this.props.imageOnloadHandler}/>
        }
    }
}
