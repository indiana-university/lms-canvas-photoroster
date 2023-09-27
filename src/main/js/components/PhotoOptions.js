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
        <div className="rvt-dropdown rvt-p-right-lg rvt-p-top-xs rvt-m-left-auto" role="region" aria-label="Controls for photo type and size" data-rvt-dropdown="dropdown-photo">
            <button
                type="button"
                id="photoOptionsDropdown"
                className="rvt-button rvt-button--secondary transparencyOverride"
                data-rvt-dropdown-toggle
                onKeyDown={handleOpening.bind(this)}>
                <span className="rvt-dropdown__toggle-text">Photo Options</span>
                <svg aria-hidden="true" fill="currentColor" width="16" height="16" viewBox="0 0 16 16"><path d="m15.146 6.263-1.292-1.526L8 9.69 2.146 4.737.854 6.263 8 12.31l7.146-6.047Z"></path></svg>
            </button>
            <div id="dropdown-photo" className="rvt-dropdown__menu" data-rvt-dropdown-menu hidden>
                <fieldset className="rvt-fieldset rvt-p-left-sm">
                    <legend className="rvt-text-bold rvt-p-tb-xs">Photo Type</legend>
                    <ul className="rvt-list-plain">
                        <li>
                            <div className="rvt-radio">
                                <input type="radio" name="radio-photoType" id="radio-official-sm" value={IMAGE_MODES.iu_small}
                                    checked={IMAGE_MODES.iu_small === props.image_mode} onChange={handleTypeOptionChange.bind(this)}
                                    onKeyDown={handleRadios.bind(this)} />
                                <label htmlFor="radio-official-sm" className="rvt-m-right-sm photo-option">Official IU (small)</label>
                            </div>
                        </li>
                        <li>
                            <div className="rvt-radio">
                                <input type="radio" name="radio-photoType" id="radio-official-med" value={IMAGE_MODES.iu_medium}
                                    checked={IMAGE_MODES.iu_medium === props.image_mode} onChange={handleTypeOptionChange.bind(this)}
                                    onKeyDown={handleRadios.bind(this)} />
                                <label htmlFor="radio-official-med" className="rvt-m-right-sm photo-option">Official IU (medium)</label>
                            </div>
                        </li>
                        <li>
                            <div className="rvt-radio">
                                <input type="radio" name="radio-photoType" id="radio-canvas" value={IMAGE_MODES.canvas}
                                    checked={IMAGE_MODES.canvas === props.image_mode} onChange={handleTypeOptionChange.bind(this)}
                                    onKeyDown={handleRadios.bind(this)} />
                                <label htmlFor="radio-canvas" className="rvt-m-right-sm photo-option">Canvas</label>
                            </div>
                        </li>
                    </ul>
                </fieldset>
            </div>
        </div>
    );
}

export default PhotoOptions;
