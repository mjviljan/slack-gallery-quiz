import './index.less'
import { FilterSelection } from '../../types/types'

import * as React from 'react'
import { Filter } from '../Filter'
import { Statistics } from '../Statistics'

export interface StatisticsProps {
    remaining: number
    correctAnswers: number
    answerCorrect: boolean
    showFailedGuessesOption: boolean
    selectedFilter: FilterSelection
    filterSelectionHandler: (selection: FilterSelection) => void
}

export class Controls extends React.Component<StatisticsProps, {}> {
    render() {
        return (
            <div className="Controls">
                <Filter
                    showFailedGuessesOption={this.props.showFailedGuessesOption}
                    selectedFilter={this.props.selectedFilter}
                    filterSelectionHandler={this.props.filterSelectionHandler}
                />
                <hr />
                <Statistics
                    remaining={this.props.remaining}
                    correctAnswers={this.props.correctAnswers}
                    answerCorrect={this.props.answerCorrect}
                />
            </div>
        )
    }
}
