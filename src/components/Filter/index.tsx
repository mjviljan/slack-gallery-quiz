import "./index.less"
import { FilterSelection } from "../../logic/quiz/types"

import * as React from "react"

export interface FilterProps {
    selectedFilter: FilterSelection,
    filterSelectionHandler: (selection: FilterSelection) => void
}

export class Filter extends React.Component<FilterProps, {}> {
    buttonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        this.props.filterSelectionHandler(event.currentTarget.value as FilterSelection)
    }

    render() {
        return (
            <div className="Filters">
                <button
                    className={this.props.selectedFilter === FilterSelection.ALL ? "active" : ""}
                    type="button"
                    onClick={this.buttonClick}
                    value={FilterSelection.ALL}>All</button>
                <button
                    className={this.props.selectedFilter === FilterSelection.RND10 ? "active" : ""}
                    type="button"
                    onClick={this.buttonClick}
                    value={FilterSelection.RND10}>Random 10</button>
                <button
                    className={this.props.selectedFilter === FilterSelection.FAILURES ? "active" : ""}
                    disabled
                    type="button"
                    onClick={this.buttonClick}
                    value={FilterSelection.FAILURES}>Latest failed</button>
            </div>
        )
    }
}
