import React from 'react';
import { IMAGE_MODES } from 'utils/Constants'
import { Dropdown } from "rivet-react"

const PhotoOptions = (props) => {

    if (!props.showPhotoOptions) {
        return null;
    }

  const handleTypeOptionChange = (event) => {
    console.debug(event.target.value);

    props.changePhotoOptions(event.target.value);
  };

    return (
        <div className="rvt-dropdown rvt-p-right-sm rvt-p-top-xs rvt-m-left-auto">
            <Dropdown label="Photo Options" modifier="secondary" >
                <fieldset className="rvt-p-left-sm">
                    <legend className="rvt-text-bold">Photo Type</legend>
                    <ul className="rvt-plain-list">
                        <li>
                            <input type="radio" name="radio-photoType" id="radio-official-sm" value={IMAGE_MODES.iu_small}
                                checked={IMAGE_MODES.iu_small === props.image_mode} onChange={handleTypeOptionChange.bind(this)} />
                            <label htmlFor="radio-official-sm" className="rvt-m-right-sm photo-option">Official IU (small)</label>
                        </li>
                        <li>
                            <input type="radio" name="radio-photoType" id="radio-official-med" value={IMAGE_MODES.iu_medium}
                                checked={IMAGE_MODES.iu_medium === props.image_mode} onChange={handleTypeOptionChange.bind(this)} />
                            <label htmlFor="radio-official-med" className="rvt-m-right-sm photo-option">Official IU (medium)</label>
                        </li>
                        <li>
                            <input type="radio" name="radio-photoType" id="radio-canvas" value={IMAGE_MODES.canvas}
                                checked={IMAGE_MODES.canvas === props.image_mode} onChange={handleTypeOptionChange.bind(this)} />
                            <label htmlFor="radio-canvas" className="rvt-m-right-sm photo-option">Canvas</label>
                        </li>
                    </ul>
                </fieldset>
            </Dropdown>
        </div>
    );
}

export default PhotoOptions;