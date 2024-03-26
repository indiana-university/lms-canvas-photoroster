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
import Roles from './user/Roles'
import Ferpa from './user/Ferpa'
import EmailInfo from './user/EmailInfo'
import Name from './user/Name'
import Pronouns from './user/Pronouns'

import { IMAGE_MODES } from '../utils/Constants'

const UserModal = (props) => {
    let modalContents;

    if (props.modalUser) {
        modalContents = (
            <div>
                <header className="rvt-dialog__header">
                    <h1 tabIndex="-1" className="rvt-dialog__title" id="modal-card-popup-title">{props.modalUser.user.name}</h1>
                </header>
                <div id="modalBody" className="rvt-dialog__body">
                    <div className="rvt-p-all-sm">
                    <div className="rvt-row">
                        <div className="rvt-cols rvt-text-center" id="modal-image">
                            <img src={props.modalUser.imageMap[props.image_mode]} className={`image-${props.image_mode}`} alt={`Photo of ${props.modalUser.user.name}`} />
                            <Ferpa ferpaRendered={props.modalUser.ferpaRestricted} modal={true} imageKey={props.image_mode} />
                        </div>
                        <div className="rvt-cols">
                            <Name inModal={true} displayName={props.modalUser.user.name} srName={props.modalUser.user.name} recordingUrl={props.modalUser.recordingUrl} />
                            <Pronouns pronouns={props.modalUser.preferredPronouns} inModal={true} srName={props.modalUser.user.name} />
                            <div id="modal-email" className="rvt-ts-xs forceWrap rvt-p-bottom-xs"><a href={"mailto:" + props.modalUser.user.email} title={`Send email to ${props.modalUser.user.name}`}>{props.modalUser.user.email} </a></div>
                            <Roles enrollmentData={props.modalEnrollments} allGroups={props.allGroups} />
                        </div>
                    </div>
                    </div>
                </div>
                <div className="rvt-dialog__controls">
                    <button className="rvt-button rvt-button--secondary" data-rvt-dialog-close="modal-card-popup">Close</button>
                </div>
                <button className="rvt-button rvt-dialog__close" data-rvt-dialog-close="modal-card-popup">
                    <span className="rvt-sr-only">Close</span>
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                        <path fill="currentColor" d="M9.41,8l5.29-5.29a1,1,0,0,0-1.41-1.41L8,6.59,2.71,1.29A1,1,0,0,0,1.29,2.71L6.59,8,1.29,13.29a1,1,0,1,0,1.41,1.41L8,9.41l5.29,5.29a1,1,0,0,0,1.41-1.41Z"/>
                    </svg>
                </button>
            </div>
        )
    }

    return (
        <div className="rvt-dialog"
             id="modal-card-popup"
             role="dialog"
             aria-modal="true"
             aria-labelledby="modal-card-popup-title"
             data-rvt-dialog="modal-card-popup"
             data-rvt-dialog-modal
             data-rvt-dialog-darken-page
             data-rvt-dialog-disable-page-interaction
             hidden>
                {modalContents}
            </div>

    )
}

export default UserModal
