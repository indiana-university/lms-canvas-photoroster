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
import React, { Component } from 'react'
import Users from 'containers/Users'
import NoData from 'components/user/NoData'
import { flatten } from 'lodash';

const UsersGrouped = (props) => {

    if (props.loading) {
          return null
    }

    if (props.orderedEnrMapKeys.length > 0) {
      const groups = props.orderedEnrMapKeys.map((key) => (
          (
          <GroupWrapper secondGrouping={props.secondGrouping}
                        key={key}
                        dataKey={key}
                        group1DataMap={props.group1DataMap}
                        group2DataMap={props.group2DataMap}
                        enrollmentData={props.enrollmentMap[key]}
                        users={userFilter(props.users, props.enrollmentMap[key])}
                        openModalMethod={props.openModalMethod}
                        view_mode={props.view_mode} image_mode={props.image_mode}
                        allGroups={props.allGroups} />
          )
      ))
        return (
          <div>
              {groups}
          </div>
        );
    } else {
        return <NoData/>;
    }
}

function GroupWrapper(props) {
    if (props.users.length > 0) {
        return (
            <div className="grouping">
              <GroupHeader secondGrouping={props.secondGrouping} dataKey={props.dataKey} dataMap={props.group1DataMap} />
              <Group key={props.dataKey} groupTitle={props.dataKey}
                    secondGrouping={props.secondGrouping}
                    users={props.users}
                    dataMap={props.group2DataMap}
                    enrollmentData={props.enrollmentData}
                    dataKey={props.dataKey}
                    openModalMethod={props.openModalMethod}
                    view_mode={props.view_mode} image_mode={props.image_mode}
                    allGroups={props.allGroups} />
            </div>
        )
    } else {
        return null
    }

}

function userFilter(userList, enrollments) {
    // If enrollments is a list, we're good.
    // If it's a map, we need to flatten down the values together
    let flattenedEnrollments = []
    if (enrollments instanceof Array) {
        flattenedEnrollments = enrollments
    } else {
        // Flatten
        Object.keys(enrollments).map(function(key) {
            flattenedEnrollments.push(enrollments[key])
        })
    }
    let filteredList = userList.filter(function (el) {
        return flatten(flattenedEnrollments).some(function (f) {
            return f.userId === el.user.id
        })
    })
    return filteredList
}

function GroupHeader(props) {
    if (props.dataKey) {
        const title = props.dataMap[props.dataKey]
        if (props.secondGrouping) {
           return (<h4 className="rvt-ts-18">{title}</h4>)
        } else {
           return (<h3 className="rvt-ts-26 rvt-m-top-sm">{title}</h3>)
        }
    } else {
        return null;
    }
}

  function Group(props) {
    let groupData
    if (props.dataMap) {
        groupData = <UsersGrouped group1DataMap={props.dataMap}
                users={props.users}
                enrollmentMap={props.enrollmentData}
                secondGrouping={true}
                openModalMethod={props.openModalMethod}
                view_mode={props.view_mode} image_mode={props.image_mode}
                allGroups={props.allGroups} groupingKey={props.dataKey} />
    } else {
        groupData = <Users users={props.users}
                enrollmentData={props.enrollmentData}
                openModalMethod={props.openModalMethod}
                view_mode={props.view_mode} image_mode={props.image_mode}
                allGroups={props.allGroups}
                groupingKey={props.dataKey} />
    }
    return (
        <div>
            {groupData}
        </div>
      )
  }

export default UsersGrouped
