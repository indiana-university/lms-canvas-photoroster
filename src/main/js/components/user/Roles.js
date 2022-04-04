import React from 'react'
import { groupBy, join } from 'lodash';
import { convertGroupIdsToNames, caseInsensitiveSort } from '../../utils/Helper'

const Roles = (props) => {
    const groupedEnrollments = groupBy(props.enrollmentData, "roleName");

    if (Object.keys(groupedEnrollments).length > 0) {
        const roles = Object.entries(groupedEnrollments).map(([key,value]) => (
          <Role key={key} roleName={key} enrollments={value} allGroups={props.allGroups} />
        ))

        return (
          <div>
              {roles}
          </div>
        )
    } else {
        return null;
    }
  }

  function Role(props) {
    const secondaryClass = (props.enrollments[0].badgeble ? '': 'rvt-badge--secondary student-badge')
    var sections = []
    props.enrollments.map((sri, index) => (
        sections.push(sri.sectionName)
    ))

    // remove duplicates that might occur in the Group view
    sections = [...new Set(sections)]

    let groupToolTip = "";
    if (props.allGroups && props.allGroups.length > 0) {
        groupToolTip = "Groups: ";
        // The conversion method will remove the UNGROUPED group from their memberships
        let groupNames = convertGroupIdsToNames(props.enrollments[0].groupMemberships, props.allGroups, true)
        if (groupNames && groupNames.length > 0) {
           groupToolTip = groupToolTip.concat(join(groupNames, ', '))
        } else {
            groupToolTip += "None"
        }
    }

    sections.sort(caseInsensitiveSort);

    let toolTip = "Sections: " + join(sections, ', ');
    if(groupToolTip.length > 0)
        toolTip = toolTip.concat("\n" + groupToolTip);

    let srRole = "Role: " + props.roleName + " , " + toolTip;

    return (
        <div className="rvt-ts-xs">
            <span title={toolTip} aria-hidden="true" className={`roleContainer rvt-badge rvt-m-right-xxs rvt-m-bottom-xxs ${secondaryClass}`}>
                {props.roleName}
            </span>
            <span className="sr-only">{srRole}</span>
        </div>
      )
  }


export default Roles