import './index.less'
import { FilterSelection } from '../../types/types'

import * as React from 'react'

export interface FilterProps {
    showFailedGuessesOption: boolean
    selectedFilter: FilterSelection
    filterSelectionHandler: (selection: FilterSelection) => void
}

export const Filter = ({ showFailedGuessesOption, selectedFilter, filterSelectionHandler }: FilterProps) => {
    const buttonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        filterSelectionHandler(event.currentTarget.value as FilterSelection)
    }

    return (
        <div className='Filters'>
            <button
                className={selectedFilter === FilterSelection.ALL ? 'active' : ''}
                type='button'
                onClick={buttonClick}
                value={FilterSelection.ALL}
            >
                All
            </button>
            <button
                className={selectedFilter === FilterSelection.NEWEST10 ? 'active' : ''}
                type='button'
                onClick={buttonClick}
                value={FilterSelection.NEWEST10}
            >
                Newest 10
            </button>
            <button
                className={selectedFilter === FilterSelection.NEWEST25 ? 'active' : ''}
                type='button'
                onClick={buttonClick}
                value={FilterSelection.NEWEST25}
            >
                Newest 25
            </button>
            <button
                className={selectedFilter === FilterSelection.RND10 ? 'active' : ''}
                type='button'
                onClick={buttonClick}
                value={FilterSelection.RND10}
            >
                Random 10
            </button>
            <button
                className={selectedFilter === FilterSelection.FAILURES ? 'active' : ''}
                disabled={!showFailedGuessesOption}
                type='button'
                onClick={buttonClick}
                value={FilterSelection.FAILURES}
            >
                Latest failed
            </button>
        </div>
    )
}
