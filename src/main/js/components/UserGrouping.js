/*-
 * #%L
 * photoroster
 * %%
 * Copyright (C) 2015 - 2022 Indiana University
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
import React, { Component } from 'react'
import { GROUPING_BY } from 'utils/Constants'

class UserGrouping extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div className="rvt-dropdown rvt-p-top-xs rvt-m-right-sm-md-up" role="region" aria-label="Controls for grouping course participants" data-rvt-dropdown="dropdown-grouping">
                <button
                    id="groupByDropdown"
                    type="button"
                    className="rvt-button rvt-button--secondary transparencyOverride"
                    data-rvt-dropdown-toggle="grouping-options"
                    onKeyDown={this.handleOpening.bind(this)}>
                        <span className="rvt-dropdown__toggle-text">Group By</span>
                        <svg aria-hidden="true" fill="currentColor" width="16" height="16" viewBox="0 0 16 16"><path d="m15.146 6.263-1.292-1.526L8 9.69 2.146 4.737.854 6.263 8 12.31l7.146-6.047Z"></path></svg>
                </button>
                <div id="dropdown-grouping" className="rvt-dropdown__menu" data-rvt-dropdown-menu="grouping-options" hidden>
                    <fieldset className="rvt-fieldset rvt-p-left-sm">
                        <legend className="rvt-sr-only">Group By Options</legend>
                        <ul className="rvt-list-plain">
                            <li>
                                <div className="rvt-radio">
                                    <input type="radio" name="radio-groupType" id="radio-nogroup" onChange={this.handleGrouping.bind(this)}
                                        value={GROUPING_BY.noGroup} checked={GROUPING_BY.noGroup === this.props.peopleGrouping}
                                        onKeyDown={this.handleRadios.bind(this)} />
                                    <label htmlFor="radio-nogroup" className="rvt-m-right-sm">No Grouping</label>
                                </div>
                            </li>
                            <li>
                                <div className="rvt-radio">
                                    <input type="radio" name="radio-groupType" id="radio-role" onChange={this.handleGrouping.bind(this)}
                                        value={GROUPING_BY.role} checked={GROUPING_BY.role === this.props.peopleGrouping}
                                        onKeyDown={this.handleRadios.bind(this)} />
                                    <label htmlFor="radio-role">Role</label>
                                </div>
                            </li>
                            <li>
                                <div className="rvt-radio">
                                    <input type="radio" name="radio-groupType" id="radio-section" onChange={this.handleGrouping.bind(this)}
                                        value={GROUPING_BY.section} checked={GROUPING_BY.section === this.props.peopleGrouping}
                                        onKeyDown={this.handleRadios.bind(this)} />
                                    <label htmlFor="radio-section">Section</label>
                                </div>
                            </li>
                            <GroupOption groups={this.props.groups} peopleGrouping={this.props.peopleGrouping} handleGrouping={this.handleGrouping.bind(this)}
                                handleRadios={this.handleRadios.bind(this)}/>
                        </ul>
                    </fieldset>
                </div>
            </div>
        );
    }

    handleGrouping(event) {
        this.props.groupPeople(event.target.value)
     }

     handleRadios(event) {
        this.props.radioDropdownNavigation(event, "dropdown-grouping", "radio-groupType", true);
     }

     handleOpening(event) {
        this.props.radioDropdownOpening(event, "radio-groupType");
     }
}



function GroupOption(props) {
    if (props.groups && props.groups.length > 0) {
        return (
            <li>
                <div className="rvt-radio">
                    <input type="radio" name="radio-groupType" id="radio-group" onChange={props.handleGrouping}
                        value={GROUPING_BY.group} checked={GROUPING_BY.group === props.peopleGrouping}
                        onKeyDown={props.handleRadios} />
                    <label htmlFor="radio-group">Group</label>
                </div>
            </li>
        )
    } else {
        return null;
    }
}

export default UserGrouping;
