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
