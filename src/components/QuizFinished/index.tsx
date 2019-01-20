import "./index.less"

import { FilterSelection } from "../../logic/quiz/types"
import * as React from "react"

export interface QuizFinishedProps {
    restartFunction: (() => void) | null
}

export class QuizFinished extends React.Component<QuizFinishedProps, {}> {

    onRestartClicked = (clickEvent : React.MouseEvent) => {
        clickEvent.preventDefault()

        if (this.props.restartFunction) {
            this.props.restartFunction()
        }
    }

    render() {
        return (
            <div className="QuizFinished">
                <div className="Congratulations">
                    <div className="TextRow">
                        <div className="WiggleLetterCW">G</div>
                        <div className="WiggleLetterCCW">o</div>
                        <div className="WiggleLetterCW">o</div>
                        <div className="WiggleLetterCCW">d</div>
                    </div>
                    <div className="TextRow">
                        <div className="WiggleLetterCW">j</div>
                        <div className="WiggleLetterCCW">o</div>
                        <div className="WiggleLetterCW">b</div>
                        <div className="WiggleLetterCCW">!</div>
                    </div>
                </div>
                <div className={this.props.restartFunction ? "RestartLink" : "Hidden"}>
                    <a href="#" onClick={this.onRestartClicked}>Restart quiz with failed guesses only ↺</a>
                </div>
            </div>
        )
    }
}
