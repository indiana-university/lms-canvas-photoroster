import React from 'react'

const Loading = (props) => {
    if (props.loading) {
        const svg = {"width" : 50, "height" : 50, "color" : "#006298"};
        return (
            <div className="rvt-m-tb-xl rvt-container rvt-container--center">
                <div className="rvt-grid loader_container">
                    <div className="rvt-grid__item rvt-text-right">
                        <svg aria-hidden="true" width={svg.width} height={svg.height} version="1.1" id="L2" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 100 100" enableBackground="new 0 0 100 100" xmlSpace="preserve">
                            <circle fill="none" stroke={svg.color} strokeWidth="4" strokeMiterlimit="10" cx="50" cy="50" r="48"></circle>
                            <line fill="none" strokeLinecap="round" stroke={svg.color} strokeWidth="4" strokeMiterlimit="10" x1="50" y1="50" x2="85" y2="50.5" transform="rotate(76.5634 50 50)">
                                <animateTransform attributeName="transform" dur="2s" type="rotate" from="0 50 50" to="360 50 50" repeatCount="indefinite"></animateTransform>
                            </line>
                            <line fill="none" strokeLinecap="round" stroke={svg.color} strokeWidth="4" strokeMiterlimit="10" x1="50" y1="50" x2="49.5" y2="74" transform="rotate(274.208 50 50)">
                                <animateTransform attributeName="transform" dur="15s" type="rotate" from="0 50 50" to="360 50 50" repeatCount="indefinite"></animateTransform>
                            </line>
                        </svg>
                    </div>
                    <div className="rvt-grid__item rvt-text-left" aria-live="polite">
                        <span id="loading-text" className="rvt-ts-md ">Loading...</span>
                    </div>
                </div>
            </div>
        )
    } else {
        return null;
    }
}

export default Loading