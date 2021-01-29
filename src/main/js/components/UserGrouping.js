import React, { Component } from 'react'
import { GROUPING_BY } from 'utils/Constants'
import { Dropdown } from "rivet-react"

class UserGrouping extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div className="rvt-dropdown rvt-p-top-xs rvt-m-right-sm-md-up">
                <Dropdown label="Group By" modifier="secondary" >
                        <fieldset className="rvt-p-left-sm">
                            <legend className="sr-only">Group By Options</legend>
                            <ul className="rvt-plain-list">
                                <li>
                                    <input type="radio" name="radio-groupType" id="radio-nogroup" onChange={this.handleGrouping.bind(this)}
                                    value={GROUPING_BY.noGroup} checked={GROUPING_BY.noGroup === this.props.peopleGrouping} />
                                    <label htmlFor="radio-nogroup" className="rvt-m-right-sm">No Grouping</label>
                                </li>
                                <li>
                                    <input type="radio" name="radio-groupType" id="radio-role" onChange={this.handleGrouping.bind(this)}
                                        value={GROUPING_BY.role} checked={GROUPING_BY.role === this.props.peopleGrouping} />
                                    <label htmlFor="radio-role">Role</label>
                                </li>
                                <li>
                                    <input type="radio" name="radio-groupType" id="radio-section" onChange={this.handleGrouping.bind(this)}
                                        value={GROUPING_BY.section} checked={GROUPING_BY.section === this.props.peopleGrouping} />
                                    <label htmlFor="radio-section">Section</label>
                                </li>
                                <GroupOption groups={this.props.groups} peopleGrouping={this.props.peopleGrouping} handleGrouping={this.handleGrouping.bind(this)} />
                            </ul>
                        </fieldset>
                </Dropdown>
            </div>
        );
    }

    handleGrouping(event) {
        this.props.groupPeople(event.target.value)
     }
}



function GroupOption(props) {
    if (props.groups && props.groups.length > 0) {
        return (
            <li>
                <input type="radio" name="radio-groupType" id="radio-group" onChange={props.handleGrouping}
                    value={GROUPING_BY.group} checked={GROUPING_BY.group === props.peopleGrouping} />
                <label htmlFor="radio-group">Group</label>
            </li>
        )
    } else {
        return null;
    }
}

export default UserGrouping;