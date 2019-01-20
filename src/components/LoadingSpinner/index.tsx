import "./index.less"

import * as React from "react";

export class LoadingSpinner extends React.Component<{}, {}> {
    render() {
        return (
            <div className="LoadingSpinner">
                <div className="Circle">
                    <div className="Hub"></div>
                    <div className="ShortArm"></div>
                    <div className="LongArm"></div>
                </div>
                <div className="Text">
                    <p>Loading</p>
                </div>
            </div>
        )
    }
}
