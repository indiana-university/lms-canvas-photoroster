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
