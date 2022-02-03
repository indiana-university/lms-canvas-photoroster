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
            <div className="rvt-modal__inner">
                <header className="rvt-modal__header">
                    <h1 className="rvt-modal__title" id="modal-title">{props.modalUser.user.name}</h1>
                </header>
                <div id="modalBody" className="rvt-modal__body">
                    <div className="rvt-grid rvt-p-all-sm">
                        <div className="rvt-grid__item rvt-text-center" id="modal-image">
                            <img src={props.modalUser.imageMap[props.image_mode]} className={`image-${props.image_mode}`} alt={`Photo of ${props.modalUser.user.name}`} />
                            <Ferpa ferpaRendered={props.modalUser.ferpaRestricted} modal={true} imageKey={props.image_mode} />
                        </div>
                        <div className="rvt-grid__item">
                            <Name inModal={true} displayName={props.modalUser.user.name} srName={props.modalUser.user.name} recordingUrl={props.modalUser.recordingUrl} />
                            <Pronouns pronouns={props.modalUser.preferredPronouns} inModal={true} srName={props.modalUser.user.name} />
                            <div id="modal-email" className="rvt-ts-xs forceWrap rvt-p-bottom-xs"><a href={"mailto:" + props.modalUser.user.email} title={`Send email to ${props.modalUser.user.name}`}>{props.modalUser.user.email} </a></div>
                            <Roles enrollmentData={props.modalEnrollments} allGroups={props.allGroups} />
                        </div>
                    </div>
                </div>
                <div className="rvt-modal__controls">
                    <button className="rvt-button rvt-button--secondary" data-modal-close="close">Close</button>
                </div>
                <button className="rvt-button rvt-modal__close" data-modal-close="close">
                    <span className="rvt-sr-only">Close</span>
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                        <path fill="currentColor" d="M9.41,8l5.29-5.29a1,1,0,0,0-1.41-1.41L8,6.59,2.71,1.29A1,1,0,0,0,1.29,2.71L6.59,8,1.29,13.29a1,1,0,1,0,1.41,1.41L8,9.41l5.29,5.29a1,1,0,0,0,1.41-1.41Z"/>
                    </svg>
                </button>
            </div>
        )
    }

    return (
        <div className="rvt-modal"
             id="modal-card-popup"
             role="dialog"
             aria-labelledby="modal-title"
             aria-hidden="true"
             tabIndex="-1">
                {modalContents}
            </div>

    )
}

export default UserModal