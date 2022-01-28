import React from 'react';
import { IMAGE_MODES } from 'utils/Constants'
import { Dropdown } from "rivet-react"

const PhotoOptions = (props) => {

    if (!props.showPhotoOptions) {
        return null;
    }

  const handleTypeOptionChange = (event) => {
    console.debug(event.target.value);

    var sizeOption = null;
    if (event.target.value === IMAGE_MODES.iu) {
        //Enable size radios
        document.getElementById('radio-small').disabled = false
        document.getElementById('radio-medium').disabled = false;
    } else {
        // Disable size radios and set selection back to small
        var smallPics = document.getElementById('radio-small');
        const changeToSmall = !smallPics.checked;
        smallPics.checked = true;
        smallPics.disabled = true;
        sizeOption = IMAGE_MODES.small;
        document.getElementById('radio-medium').disabled = true;
        // if we reset size to small, announce it to the screen reader
        if (changeToSmall) {
            srSpeak("Photo size was reset to small");
        }

    }
    props.changePhotoOptions(event.target.value, sizeOption);
  };

  const handleSizeOptionChange = (event) => {
    console.debug(event.target.value);
    props.changePhotoOptions(null, event.target.value);
  };

    /**
    *   Function to add a temporary element to be announced by screenreader and then removed. For notifications
    */
    function srSpeak(text, priority) {
        var el = document.createElement("div");
        var id = "speak-" + Date.now();
        el.setAttribute("id", id);
        el.setAttribute("aria-live", "polite");
        el.classList.add("sr-only");
        document.body.appendChild(el);

        window.setTimeout(function () {
          document.getElementById(id).innerHTML = text;
        }, 100);

        window.setTimeout(function () {
            document.body.removeChild(document.getElementById(id));
        }, 1000);
    }

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
                    <legend className="rvt-text-bold">Photo Size <span class="sr-only"> for Official IU photos</span></legend>
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