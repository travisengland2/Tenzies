import React from "react"

export default function Toggler(props) {
    return (
        <div className="toggler">
            <p className="toggler--light">Light</p>
            <div className="toggler--slider" onClick={props.toggleDarkMode}>
                <div className="toggler--slider--circle"></div>
            </div>
            <p className="toggler--dark">Dark</p>
        </div>
    )
}
