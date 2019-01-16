import './index.less'

import { QuizUser } from '../../logic/quiz/types'
import * as React from "react"
import { timelinePaginationEnabledMethods } from '@slack/client';

export interface QuestionFormProps { user: QuizUser, answerHandler: (answer : string) => void }

export class QuestionForm extends React.Component<QuestionFormProps, {guess : string}> {
    constructor(props : QuestionFormProps) {
        super(props)
        this.state = {guess: ""}
    }

    handleGuessChange = (event : React.FormEvent<HTMLInputElement>) => {
        this.setState({guess: event.currentTarget.value})
    }

    submitAnswer = (event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        this.props.answerHandler(this.state.guess)

        this.setState({guess: ""})
    }

    render() {
        return (
            <div className="QuestionForm">
                <img src={this.props.user.imageUrl} />
                <div className="Question">Who is this 🐶?</div>
                <form onSubmit={this.submitAnswer}>
                    <input id="answer" type="text" value={this.state.guess} onChange={this.handleGuessChange} />
                </form>
            </div>
        )
    }

    componentDidMount() {
        const answerField = document.getElementById('answer') as HTMLInputElement
        if (answerField) {
            answerField.focus()
        }
    }
}
