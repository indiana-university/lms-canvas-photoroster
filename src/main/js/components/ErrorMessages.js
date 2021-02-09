import React from 'react'

const ErrorMessages = (props) => {
    if (props.messages.length > 0) {
        const errorMessages = props.messages.map((message, index) => (
                    <li key={index} className="rvt-alert-list__item">
                        <div className="rvt-alert rvt-alert--warning" role="alert" aria-labelledby={`alert_${index}`}>
                            <h1 id={`alert_${index}`} className="rvt-alert__title">{message}</h1>
                            <button type="button" className="rvt-alert__dismiss" data-alert-close>
                                <span className="v-hide">Dismiss this alert</span>
                                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                    <path fill="currentColor" d="M9.41,8l5.29-5.29a1,1,0,0,0-1.41-1.41L8,6.59,2.71,1.29A1,1,0,0,0,1.29,2.71L6.59,8,1.29,13.29a1,1,0,1,0,1.41,1.41L8,9.41l5.29,5.29a1,1,0,0,0,1.41-1.41Z"/>
                                </svg>
                            </button>
                        </div>
                    </li>
                ))

        return (
            <ul className="rvt-alert-list hidePrint rvt-container rvt-m-bottom-sm">
                {errorMessages}
            </ul>
        )
    } else {
        return null;
    }
}

export default ErrorMessages