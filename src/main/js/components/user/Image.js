import React from 'react'
import Ferpa from './Ferpa'
import { IMAGE_MODES } from '../../utils/Constants'

const Image = (props) => {
    const imageKey = props.image_mode == IMAGE_MODES.iu ? props.image_size : IMAGE_MODES.canvas
    // create a unique id for this user card. It must be more than the userid because they may
    // appear more than once
    let imageId = "img_" + props.userId;
    if (props.groupingKey) {
        imageId += "_" + props.groupingKey;
    }

        return (
            <div className="imageWrapper">
                <button id={imageId} className="imageContainer imageInfo popupTrigger" data-modal-trigger="modal-card-popup"
                    onClick={gogogo.bind(this, props.userId, props.openModalMethod, imageId)}>
                    <span className="rvt-sr-only">User details</span>
                    <img src={props.imageMap[imageKey]} className={`image-${imageKey}`} aria-hidden="true" />
                    <Ferpa ferpaRendered={props.ferpaRendered} modal={false} />
                </button>
            </div>
        );
}

function gogogo(userId, openModalMethod, triggerId, event) {
    // Change all of the triggers back to the default modal name
    // We change it temporarily on modal close to refocus on the correct user card
    $(".popupTrigger").attr("data-modal-trigger", "modal-card-popup");
    openModalMethod(userId, triggerId)
}

export default Image