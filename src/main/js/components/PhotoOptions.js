import React from 'react';
import { IMAGE_MODES } from 'utils/Constants'
import { Dropdown } from "rivet-react"

const PhotoOptions = (props) => {

    if (!props.showPhotoOptions) {
        return null;
    }

  const handleTypeOptionChange = (event) => {
    console.debug(event.target.value);

    if (event.target.value === IMAGE_MODES.iu) {
        //Enable size radios
        document.getElementById('radio-small').disabled = false
        document.getElementById('radio-medium').disabled = false;
    } else {
        //Disable size radios
        document.getElementById('radio-small').disabled = true
        document.getElementById('radio-medium').disabled = true;
    }

    props.changePhotoOptions(event.target.value, null);
  };

  const handleSizeOptionChange = (event) => {
    console.debug(event.target.value);
    props.changePhotoOptions(null, event.target.value);
  };

    return (
        <div className="rvt-dropdown rvt-p-right-sm rvt-p-top-xs rvt-m-left-auto">
            <Dropdown label="Photo Options" modifier="secondary" >
                <fieldset className="rvt-p-left-sm">
                    <legend className="rvt-text-bold">Photo Type</legend>
                    <ul className="rvt-plain-list">
                        <li>
                            <input type="radio" name="radio-photoType" id="radio-official" value={IMAGE_MODES.iu}
                                checked={IMAGE_MODES.iu === props.image_mode} onChange={handleTypeOptionChange.bind(this)} />
                            <label htmlFor="radio-official" className="rvt-m-right-sm">Official IU</label>
                        </li>
                        <li>
                            <input type="radio" name="radio-photoType" id="radio-canvas" value={IMAGE_MODES.canvas}
                                checked={IMAGE_MODES.canvas === props.image_mode} onChange={handleTypeOptionChange.bind(this)} />
                            <label htmlFor="radio-canvas" className="rvt-m-right-sm">Canvas</label>
                        </li>
                    </ul>
                </fieldset>
                <fieldset className="rvt-p-left-sm">
                    <legend className="rvt-text-bold">Photo Size</legend>
                    <ul className="rvt-plain-list">
                        <li>
                            <input type="radio" name="radio-photoSize" id="radio-small" value={IMAGE_MODES.small}
                                checked={IMAGE_MODES.small === props.image_size} onChange={handleSizeOptionChange.bind(this)}
                                disabled={IMAGE_MODES.canvas === props.image_mode}/>
                            <label htmlFor="radio-small" className="rvt-m-right-sm">Small</label>
                        </li>
                        <li>
                            <input type="radio" name="radio-photoSize" id="radio-medium" value={IMAGE_MODES.medium}
                                checked={IMAGE_MODES.medium === props.image_size} onChange={handleSizeOptionChange.bind(this)}
                                disabled={IMAGE_MODES.canvas === props.image_mode} />
                            <label htmlFor="radio-medium" className="rvt-m-right-sm">Medium</label>
                        </li>
                    </ul>
                </fieldset>
            </Dropdown>
        </div>
    );
}

export default PhotoOptions;