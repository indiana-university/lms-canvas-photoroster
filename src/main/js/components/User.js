import React from 'react'
import Roles from 'components/user/Roles'
import Image from 'components/user/Image'
import EmailInfo from 'components/user/EmailInfo'
import Name from 'components/user/Name'
import Pronouns from 'components/user/Pronouns'

import { IMAGE_MODES } from 'utils/Constants'
import { VIEW_MODES } from 'utils/Constants'

const User = (props) => {
  var userModel = props.userData;
  var enrollmentData = props.enrollmentData;

  const imageKey = props.image_mode == IMAGE_MODES.iu ? props.image_size : IMAGE_MODES.canvas

  if (props.view_mode == VIEW_MODES.grid) {
      return (
        <div className={`photoGridPanel rvt-box cardPanelPaddingOverride rvt-text-center rvt-m-top-sm rvt-m-right-sm card-${imageKey}`}>
            <div className="rvt-box__body">
                <Image imageMap={userModel.imageMap} username={userModel.user.login_id} ferpaRendered={userModel.ferpaRestricted}
                    userId={userModel.user.id} openModalMethod={props.openModalMethod} groupingKey={props.groupingKey}
                    image_mode={props.image_mode} image_size={props.image_size} displayName={userModel.user.sortable_name} 
                    srName={userModel.user.name} />
                <Name displayName={userModel.user.sortable_name} srName={userModel.user.name} recordingUrl={userModel.recordingUrl} />
                <Pronouns pronouns={userModel.preferredPronouns} srName={userModel.user.name} />
                <EmailInfo email={userModel.user.email} srName={userModel.user.name} />
                <Roles enrollmentData={enrollmentData} allGroups={props.allGroups} />
            </div>
        </div>
      );
  } else if (props.view_mode == VIEW_MODES.list) {
      return (
        <div className="photoListPanel rvt-box rvt-text-left rvt-m-top-sm rvt-m-right-xs">
            <div className="rvt-box__body">
                <div className="rvt-grid">
                    <div className="rvt-grid__item-3-lg">
                        <Image imageMap={userModel.imageMap} username={userModel.user.login_id} ferpaRendered={userModel.ferpaRestricted}
                            userId={userModel.user.id} openModalMethod={props.openModalMethod} groupingKey={props.groupingKey}
                            image_mode={props.image_mode} image_size={props.image_size} displayName={userModel.user.sortable_name} />
                    </div>
                    <div className="rvt-grid__item rvt-lg">
                        <Name displayName={userModel.user.sortable_name} recordingUrl={userModel.recordingUrl} />
                        <Pronouns pronouns={userModel.preferredPronouns} srName={userModel.user.name} />
                        <EmailInfo email={userModel.user.email} />
                        <Roles enrollmentData={enrollmentData} allGroups={props.allGroups} />
                    </div>
                </div>
            </div>
        </div>
      );
  } else if (props.view_mode == VIEW_MODES.signIn) {
      return (
        <tr>
            <th scope="row">{userModel.user.sortable_name}</th>
            <td>&nbsp;</td>
        </tr>
      )
  }
}

export default User
