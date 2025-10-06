/*-
 * #%L
 * photoroster
 * %%
 * Copyright (C) 2015 - 2025 Indiana University
 * %%
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 * 
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 * 
 * 3. Neither the name of the Indiana University nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 * IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
 * OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 * #L%
 */
import React from 'react'
import { VIEW_MODES } from 'utils/Constants'

const ViewActions = (props) => {
    const currSelection = " (Current selection)";
    var gridTitle = "Grid View";
    var listTitle = "List View";
    var signinTitle= "Sign-In Sheet View";

    var gridClass = ""
    var listClass = ""
    var signInClass = ""
    if (props.view_mode == VIEW_MODES.grid) {
        gridClass = "currentViewColor";
        gridTitle += currSelection;
    } else if (props.view_mode == VIEW_MODES.list) {
        listClass = "currentViewColor";
        listTitle += currSelection;
    } else if (props.view_mode == VIEW_MODES.signIn) {
        signInClass = "currentViewColor";
        signinTitle += currSelection;
    }

    /**
     * OnClick method to switch views.
     * Calls back to the changeView method defined in App.js
     */
    const handleViewChange = (viewName, event) => {
        props.changeView(viewName);
    };

    var signInMarkup = "";

    if (props.showSignInView) {
        signInMarkup = (
            <div className="rvt-p-left-xs">
                <button id="signInViewOption" className="view-option rvt-button rvt-button--secondary" onClick={handleViewChange.bind(this, VIEW_MODES.signIn)} title={signinTitle}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="4 2 92 96" x="0px" y="0px" width="24" height="24" className={signInClass}>
                        <path d="M75.89,94.58V82.25h-6v9.33H10.45V8.42H46.87v20a3,3,0,0,0,3,3h20v10.4h6V28.39A3,3,0,0,0,75,26.27L52,3.35a3,3,0,0,0-1.82-.86l-.48,0H7.45a3,3,0,0,0-3,3V94.58a3,3,0,0,0,3,3H72.89A3,3,0,0,0,75.89,94.58Zm-23-81.93L65.68,25.44H52.87Z"/>
                        <path d="M86.12,41.82a3,3,0,0,0-4.23-.28L54,65.91a3,3,0,0,0-1,1.64L50.85,78.11a3,3,0,0,0,2.93,3.62H54l10.93-.62a3,3,0,0,0,1.81-.74L94.53,56a3,3,0,0,0,.28-4.23ZM63.51,75.17l-6,.34,1.21-5.74L83.58,48l4.74,5.42Z"/>
                        <rect x="19.17" y="35" width="20" height="6"/><rect x="19.17" y="49" width="40" height="6"/>
                        <rect x="19.17" y="63" width="28" height="6"/><rect x="19.17" y="77" width="28" height="6"/>
                        <text x="0" y="115" fill="#000000" fontSize="5px" fontWeight="bold" fontFamily="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif">Created by Karan</text>
                        <text x="0" y="120" fill="#000000" fontSize="5px" fontWeight="bold" fontFamily="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif">from the Noun Project</text>
                    </svg>
                </button>
            </div>
        )
    }

    return (
        <div className="rvt-flex rvt-p-top-xs">
            <div>
                <button id="gridViewOption" className="view-option rvt-button rvt-button--secondary" onClick={handleViewChange.bind(this, VIEW_MODES.grid)} title={gridTitle} >
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="3 3 10 10" enableBackground="new 0 0 16 16" width="24" height="24" className={gridClass}>
                        <g>
                            <rect x="3" y="3" width="4" height="4"/>
                            <rect x="9" y="3" width="4" height="4"/>
                            <rect x="9" y="9" width="4" height="4"/>
                            <rect x="3" y="9" width="4" height="4"/>
                        </g>
                        <text x="0" y="31" fontSize="5px" fontWeight="bold" fontFamily="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif">Created by Jaro Sigrist</text>
                        <text x="0" y="36" fontSize="5px" fontWeight="bold" fontFamily="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif">from the Noun Project</text>
                    </svg>
                </button>
            </div>
            <div className="rvt-p-left-xs">
                <button id="listViewOption" className="view-option rvt-button rvt-button--secondary" onClick={handleViewChange.bind(this, VIEW_MODES.list)} title={listTitle}>
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="3 3 10 10" enableBackground="new 0 0 16 16" width="24" height="24" className={listClass}>
                        <g>
                            <rect x="6" y="3" width="7" height="2"/>
                            <rect x="3" y="3" width="2" height="2"/>
                            <rect x="3" y="7" width="2" height="2"/>
                            <rect x="3" y="11" width="2" height="2"/>
                            <rect x="6" y="7" width="7" height="2"/>
                            <rect x="6" y="11" width="7" height="2"/>
                        </g>
                        <text x="0" y="31" fontSize="5px" fontWeight="bold" fontFamily="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif">Created by Jaro Sigrist</text>
                        <text x="0" y="36" fontSize="5px" fontWeight="bold" fontFamily="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif">from the Noun Project</text>
                    </svg>
                </button>
            </div>
            {signInMarkup}
        </div>
    )
}

export default ViewActions
