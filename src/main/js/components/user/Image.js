import React from 'react'
import Ferpa from './Ferpa'
import { IMAGE_MODES } from '../../utils/Constants'

const Image = (props) => {
    // create a unique id for this user card. It must be more than the userid because they may
    // appear more than once
    let imageId = "img_" + props.userId;
    if (props.groupingKey) {
        imageId += "_" + props.groupingKey;
    }

        return (
            <div className="imageWrapper">
                <button id={imageId} className="imageContainer imageInfo popupTrigger pointerOverride" data-rvt-dialog-trigger="modal-card-popup"
                    onClick={gogogo.bind(this, props.userId, props.openModalMethod, imageId)}>
                    <img src={props.imageMap[props.image_mode]} className={`image-${props.image_mode}`} alt={`User details for ${props.srName}`} />
                    <Ferpa ferpaRendered={props.ferpaRendered} modal={false} />
                </button>
            </div>
        );
}

function gogogo(userId, openModalMethod, triggerId, event) {
    // Change all of the triggers back to the default modal name
    // We change it temporarily on modal close to refocus on the correct user card
    $(".popupTrigger").attr("data-rvt-dialog-trigger", "modal-card-popup");
    openModalMethod(userId, triggerId)
}

export default Image