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
import UserFilter from 'components/UserFilter'
import UserSearch from 'components/UserSearch'
import PhotoOptions from 'components/PhotoOptions'
import ViewActions from 'components/ViewActions'
import UserGrouping from 'components/UserGrouping'

const ActionBar = (props) => {
  return (
    <div className="actionBar">
        <UserFilter roles={props.roles} sections={props.sections} groups={props.groups} filterPeople={props.filterPeople} />
        <UserGrouping groups={props.groups} peopleGrouping={props.peopleGrouping} groupPeople={props.groupPeople} radioDropdownNavigation={props.radioDropdownNavigation}
            radioDropdownOpening={props.radioDropdownOpening} />
        <UserSearch searchPeople={props.searchPeople} />
        <div className="rvt-flex">
            <PhotoOptions changePhotoOptions={props.changePhotoOptions} image_mode={props.image_mode}
                showPhotoOptions={props.showPhotoOptions} radioDropdownNavigation={props.radioDropdownNavigation}
                 radioDropdownOpening={props.radioDropdownOpening} />
            <ViewActions view_mode={props.view_mode} changeView={props.changeView} showSignInView={props.showSignInView}/>
        </div>
    </div>
  )
}

export default ActionBar
