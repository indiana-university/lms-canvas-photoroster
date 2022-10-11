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

import User from 'components/User'
import NoData from 'components/user/NoData'
import { VIEW_MODES } from 'utils/Constants'

const Users = (props) => {
    if (props.loading) {
        return null
    }
    if (props.users.length > 0) {
        const users = props.users.map((userModel) => (
            <User key={userModel.user.id} userData={userModel} openModalMethod={props.openModalMethod}
                enrollmentData={props.enrollmentData.filter((i) => i.userId === userModel.user.id)}
                view_mode={props.view_mode} image_mode={props.image_mode}
                allGroups={props.allGroups} groupingKey={props.groupingKey} />
        ))
      if (props.view_mode == VIEW_MODES.signIn) {
        return (
            <SignInWrapper content={users} />
        );
      } else if (props.view_mode == VIEW_MODES.list) {
        return (
            <ListWrapper content={users} />
        );
      }  else {
          return (
            <DivWrapper content={users} />
        );
      }
    } else {
      return <NoData/>;
    }
  }

function SignInWrapper(props) {
    return (
        <div className="rvt-m-top-sm rvt-border-all rvt-border-radius transparencyOverride">
            <table className="rvt-table-cells">
                <caption className="rvt-sr-only">Printable roster sign-in sheet with name and blank space for signature</caption>
                <colgroup>
                    <col className="twentyfive-percent" />
                </colgroup>
                <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Signature</th>
                    </tr>
                </thead>
                <tbody>
                    {props.content}
                </tbody>
            </table>
        </div>
    )
}

function DivWrapper(props) {
    return (
        <div>
            {props.content}
        </div>
    )
}

function ListWrapper(props) {
    return (
        <ul className="rvt-list-plain">
            {props.content}
        </ul>
    )
}


export default Users
