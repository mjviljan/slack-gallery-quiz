import './index.less'
import { FilterSelection } from '../../types/types'

import * as React from 'react'
import { Filter } from '../Filter'
import { Statistics } from '../Statistics'

export interface ControlsProps {
    remaining: number
    correctAnswers: number
    showFailedGuessesOption: boolean
    selectedFilter: FilterSelection
    filterSelectionHandler: (selection: FilterSelection) => void
}

export const Controls = ({
                             remaining,
                             correctAnswers,
                             showFailedGuessesOption,
                             selectedFilter,
                             filterSelectionHandler,
                         }: ControlsProps) => (
    <div className='Controls'>
        <Filter
            showFailedGuessesOption={showFailedGuessesOption}
            selectedFilter={selectedFilter}
            filterSelectionHandler={filterSelectionHandler}
        />
        <hr />
        <Statistics
            remaining={remaining}
            correctAnswers={correctAnswers}
        />
    </div>
)
