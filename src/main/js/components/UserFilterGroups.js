import React from 'react'

const UserFilterGroups = (props) => {
    if (props.groups && props.groups.length > 0) {
        const groupList = props.groups.map(group => (
            <li key={group.id}>
                <input type="checkbox" id={"group_" + group.id} name="groupsCheckboxes" className="filter-input"
                    value={`${group.id}`} onChange={props.handleGroupFiltering} data-text={group.name} />
                <label htmlFor={"group_" + group.id} className="rvt-m-right-sm rvt-text-nobr">{group.name}</label>
            </li>
        ))

        return (
            <React.Fragment>
                <div>
                    <fieldset className="rvt-p-left-sm">
                        <legend className="rvt-text-bold rvt-p-tb-xs">Groups</legend>
                        <ul className="rvt-plain-list">
                            {groupList}
                        </ul>
                    </fieldset>
                </div>
            </React.Fragment>
        )
    } else {
        return null;
    }
}

export default UserFilterGroups