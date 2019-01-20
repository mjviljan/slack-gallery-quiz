import './index.less'

import * as React from "react"

export interface StatisticsProps { remaining: number, correctAnswers: number, answerCorrect: boolean }

export class Statistics extends React.Component<StatisticsProps, {}> {
    _correctMarker: React.RefObject<HTMLDivElement>

    constructor(props: StatisticsProps) {
        super(props)
        this._correctMarker = React.createRef()
    }

    componentDidUpdate() {
        const markerElement = this._correctMarker.current
        if (markerElement && this.props.answerCorrect) {
            markerElement.classList.remove('Flash')
            // force re-triggering the CSS animation
            void markerElement.offsetWidth
            markerElement.classList.add('Flash')
        }
    }

    render() {
        return (
            <div className="Statistics">
                <div className="Remaining">
                    <div className="Label">🐶</div>
                    <div className="Value">{this.props.remaining}</div>
                </div>
                <div className="Correct">
                    <div className="Label" ref={this._correctMarker} >✓</div>
                    <div className="Value">{this.props.correctAnswers}</div>
                </div>
            </div>
        )
    }
}
