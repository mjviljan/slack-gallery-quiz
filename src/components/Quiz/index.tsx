import './index.less'

import { QuizUser } from '../../logic/quiz/types'
import shuffle from "shuffle.ts"
import * as React from "react"

export interface QuizProps { users: Array<QuizUser>}

export class Quiz extends React.Component<QuizProps, QuizProps> {
    constructor(props: QuizProps) {
        super(props)
        console.log('Constructing quiz')
        this.state = {
            users: shuffle(props.users)
        }
    }

    submitAnswer = (event : React.FormEvent): void => {
        event.preventDefault()
        this.setState({
            users: this.state.users.slice(1)
        })
        const answerField = document.getElementById('answer') as HTMLInputElement
        if (answerField) {
            answerField.value = ""
        }
    }

    render() {
        return (
            <div className="Quiz">
                <img src={this.state.users[0].imageUrl} />
                <div className="Question">Who is this 🐶?</div>
                <form onSubmit={this.submitAnswer}>
                    <input id="answer" type="text" />
                </form>
            </div>
        );
    }

    componentDidMount() {
        const answerField = document.getElementById('answer') as HTMLInputElement
        if (answerField) {
            answerField.focus()
        }
    }
}
