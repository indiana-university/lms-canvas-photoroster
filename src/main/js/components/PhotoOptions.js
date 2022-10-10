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
import React from 'react';
import { IMAGE_MODES } from 'utils/Constants'

const PhotoOptions = (props) => {

    if (!props.showPhotoOptions) {
        return null;
    }

  const handleTypeOptionChange = (event) => {
    console.debug(event.target.value);

    props.changePhotoOptions(event.target.value);
  };

  const handleRadios = (event) => {
    props.radioDropdownNavigation(event, "dropdown-photo", "radio-photoType", false);
  };

  const handleOpening = (event) => {
    props.radioDropdownOpening(event, "radio-photoType");
  };

    return (
        <div className="rvt-dropdown rvt-p-right-sm rvt-p-top-xs rvt-m-left-auto" role="region" aria-label="Controls for photo type and size">
            <button
                type="button"
                id="photoOptionsDropdown"
                className="rvt-button rvt-button--secondary rvt-m-right-sm-md-up"
                data-dropdown-toggle="dropdown-photo"
                aria-haspopup="true"
                aria-expanded="false"
                onKeyDown={handleOpening.bind(this)}>
                <span className="dropdown__toggle-text">Photo Options</span>
                <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M8,12.46a2,2,0,0,1-1.52-.7L1.24,5.65a1,1,0,1,1,1.52-1.3L8,10.46l5.24-6.11a1,1,0,0,1,1.52,1.3L9.52,11.76A2,2,0,0,1,8,12.46Z"></path></svg>
            </button>
            <div className="rvt-dropdown__menu" id="dropdown-photo" aria-hidden="true">
                <fieldset className="rvt-p-left-sm">
                    <legend className="rvt-text-bold">Photo Type</legend>
                    <ul className="rvt-plain-list">
                        <li>
                            <input type="radio" name="radio-photoType" id="radio-official-sm" value={IMAGE_MODES.iu_small}
                                checked={IMAGE_MODES.iu_small === props.image_mode} onChange={handleTypeOptionChange.bind(this)}
                                onKeyDown={handleRadios.bind(this)} />
                            <label htmlFor="radio-official-sm" className="rvt-m-right-sm photo-option">Official IU (small)</label>
                        </li>
                        <li>
                            <input type="radio" name="radio-photoType" id="radio-official-med" value={IMAGE_MODES.iu_medium}
                                checked={IMAGE_MODES.iu_medium === props.image_mode} onChange={handleTypeOptionChange.bind(this)}
                                onKeyDown={handleRadios.bind(this)} />
                            <label htmlFor="radio-official-med" className="rvt-m-right-sm photo-option">Official IU (medium)</label>
                        </li>
                        <li>
                            <input type="radio" name="radio-photoType" id="radio-canvas" value={IMAGE_MODES.canvas}
                                checked={IMAGE_MODES.canvas === props.image_mode} onChange={handleTypeOptionChange.bind(this)}
                                onKeyDown={handleRadios.bind(this)} />
                            <label htmlFor="radio-canvas" className="rvt-m-right-sm photo-option">Canvas</label>
                        </li>
                    </ul>
                </fieldset>
            </div>
        </div>
    );
}

export default PhotoOptions;
