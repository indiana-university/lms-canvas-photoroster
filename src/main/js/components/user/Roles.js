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
