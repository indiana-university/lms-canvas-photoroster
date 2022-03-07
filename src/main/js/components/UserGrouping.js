import React, { Component } from 'react'
import { GROUPING_BY } from 'utils/Constants'

class UserGrouping extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div className="rvt-dropdown rvt-p-top-xs rvt-m-right-sm-md-up" role="region" aria-label="Controls for grouping course participants">
                <button
                    type="button"
                    className="rvt-button rvt-button--secondary rvt-m-right-sm-md-up"
                    data-dropdown-toggle="dropdown-grouping"
                    aria-haspopup="true"
                    aria-expanded="false"
                    onKeyDown={this.handleOpening.bind(this)}>
                        <span className="dropdown__toggle-text">Group By</span>
                        <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M8,12.46a2,2,0,0,1-1.52-.7L1.24,5.65a1,1,0,1,1,1.52-1.3L8,10.46l5.24-6.11a1,1,0,0,1,1.52,1.3L9.52,11.76A2,2,0,0,1,8,12.46Z"></path></svg>
                </button>
                <div className="rvt-dropdown__menu" id="dropdown-grouping" aria-hidden="true">
                    <fieldset className="rvt-p-left-sm">
                        <legend className="sr-only">Group By Options</legend>
                        <ul className="rvt-plain-list">
                            <li>
                                <input type="radio" name="radio-groupType" id="radio-nogroup" onChange={this.handleGrouping.bind(this)}
                                    value={GROUPING_BY.noGroup} checked={GROUPING_BY.noGroup === this.props.peopleGrouping}
                                    onKeyDown={this.handleRadios.bind(this)} />
                                <label htmlFor="radio-nogroup" className="rvt-m-right-sm">No Grouping</label>
                            </li>
                            <li>
                                <input type="radio" name="radio-groupType" id="radio-role" onChange={this.handleGrouping.bind(this)}
                                    value={GROUPING_BY.role} checked={GROUPING_BY.role === this.props.peopleGrouping}
                                    onKeyDown={this.handleRadios.bind(this)} />
                                <label htmlFor="radio-role">Role</label>
                            </li>
                            <li>
                                <input type="radio" name="radio-groupType" id="radio-section" onChange={this.handleGrouping.bind(this)}
                                    value={GROUPING_BY.section} checked={GROUPING_BY.section === this.props.peopleGrouping}
                                    onKeyDown={this.handleRadios.bind(this)} />
                                <label htmlFor="radio-section">Section</label>
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
                <input type="radio" name="radio-groupType" id="radio-group" onChange={props.handleGrouping}
                    value={GROUPING_BY.group} checked={GROUPING_BY.group === props.peopleGrouping}
                    onKeyDown={props.handleRadios} />
                <label htmlFor="radio-group">Group</label>
            </li>
        )
    } else {
        return null;
    }
}

export default UserGrouping;