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

  if (props.view_mode == VIEW_MODES.grid) {
      return (
        <div className={`rvt-border-all rvt-border-radius transparencyOverride photoGridPanel cardPanelPaddingOverride rvt-text-center rvt-m-top-sm rvt-m-right-sm card-${props.image_mode}`}>
                <Image imageMap={userModel.imageMap} username={userModel.user.login_id} ferpaRendered={userModel.ferpaRestricted}
                    userId={userModel.user.id} openModalMethod={props.openModalMethod} groupingKey={props.groupingKey}
                    image_mode={props.image_mode} displayName={userModel.user.sortable_name}
                    srName={userModel.user.name} />
                <Name displayName={userModel.user.sortable_name} srName={userModel.user.name} recordingUrl={userModel.recordingUrl} />
                <Pronouns pronouns={userModel.preferredPronouns} srName={userModel.user.name} />
                <EmailInfo email={userModel.user.email} srName={userModel.user.name} />
                <Roles enrollmentData={enrollmentData} allGroups={props.allGroups} />
        </div>
      );
  } else if (props.view_mode == VIEW_MODES.list) {
      return (
        <li className="rvt-border-all rvt-border-radius photoListPanel rvt-text-left rvt-m-top-sm rvt-m-right-xs transparencyOverride">
            <div className="rvt-row rvt-p-all-sm">
                <div>
                    <Image imageMap={userModel.imageMap} username={userModel.user.login_id} ferpaRendered={userModel.ferpaRestricted}
                        userId={userModel.user.id} openModalMethod={props.openModalMethod} groupingKey={props.groupingKey}
                        image_mode={props.image_mode} displayName={userModel.user.sortable_name}
                        srName={userModel.user.name}/>
                </div>
                <div className="rvt-cols">
                    <Name displayName={userModel.user.sortable_name} srName={userModel.user.name} recordingUrl={userModel.recordingUrl} />
                    <Pronouns pronouns={userModel.preferredPronouns} srName={userModel.user.name} />
                    <EmailInfo email={userModel.user.email} srName={userModel.user.name} />
                    <Roles enrollmentData={enrollmentData} allGroups={props.allGroups} />
                </div>
            </div>
        </li>
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
