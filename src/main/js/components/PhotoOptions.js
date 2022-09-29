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
        <div className="rvt-dropdown rvt-p-right-sm rvt-p-top-xs" role="region" aria-label="Controls for photo type and size" data-rvt-dropdown="dropdownDefault">
            <button
                type="button"
                id="photoOptionsDropdown"
                className="rvt-button rvt-button--secondary rvt-m-right-sm-md-up transparencyOverride"
                data-rvt-dropdown-toggle="dropdown-photo"
                aria-haspopup="true"
                aria-expanded="false"
                onKeyDown={handleOpening.bind(this)}>
                <span className="rvt-dropdown__toggle-text">Photo Options</span>
                <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M8,12.46a2,2,0,0,1-1.52-.7L1.24,5.65a1,1,0,1,1,1.52-1.3L8,10.46l5.24-6.11a1,1,0,0,1,1.52,1.3L9.52,11.76A2,2,0,0,1,8,12.46Z"></path></svg>
            </button>
            <div className="rvt-dropdown__menu" id="dropdown-photo" hidden data-rvt-dropdown-menu>
                <fieldset className="rvt-fieldset rvt-p-left-sm">
                    <legend className="rvt-text-bold">Photo Type</legend>
                    <ul className="rvt-list-plain">
                        <li>
                            <div class="rvt-radio">
                                <input type="radio" name="radio-photoType" id="radio-official-sm" value={IMAGE_MODES.iu_small}
                                    checked={IMAGE_MODES.iu_small === props.image_mode} onChange={handleTypeOptionChange.bind(this)}
                                    onKeyDown={handleRadios.bind(this)} />
                                <label htmlFor="radio-official-sm" className="rvt-m-right-sm photo-option">Official IU (small)</label>
                            </div>
                        </li>
                        <li>
                            <div class="rvt-radio">
                                <input type="radio" name="radio-photoType" id="radio-official-med" value={IMAGE_MODES.iu_medium}
                                    checked={IMAGE_MODES.iu_medium === props.image_mode} onChange={handleTypeOptionChange.bind(this)}
                                    onKeyDown={handleRadios.bind(this)} />
                                <label htmlFor="radio-official-med" className="rvt-m-right-sm photo-option">Official IU (medium)</label>
                            </div>
                        </li>
                        <li>
                            <div class="rvt-radio">
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