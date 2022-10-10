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
import uuid from 'react-native-uuid'

class NameCoach extends React.Component {

    constructor(props) {
        super(props);

        //Generate a unique uuid so we can tie all the dom elements together and throw it in the state
        this.state = {uuid: uuid.v1()};
    }

    /**
     *  Run this javascript when the component mounts
     */
    componentDidMount() {
        if (this.props.recordingUrl) {
            this.init(this.state.uuid, this.props.recordingUrl);
        }
    }

    /*
     * Run this javascript when the component updates.  Mostly useful for the modal popup since it only mounts once.
     */
    componentDidUpdate() {
        if (this.props.recordingUrl && this.props.inModal) {
            this.init(this.state.uuid, this.props.recordingUrl);
        }
    }

    render() {
        var ncData = null
        if (!this.props.recordingUrl) {
            return null;
        }

        return (
            <span className="namecoach">
                <span id={`container_${this.state.uuid}`} style={{position: 'relative', height: '30px', width: '30px', opacity: 1}}>
                    <span id={`playback_${this.state.uuid}`} style={{}}>
                        <img className="logo-sign" src="https://www.name-coach.com/images/animate.gif" width="20" alt="Name recording playing" />
                    </span>
                    <img id={`image_${this.state.uuid}`} role="button" tabIndex="0" alt={`Recorded pronunciation of ${this.props.srName}`} src="https://www.name-coach.com/images/spkr2.jpg" width="20" />
                </span>
            </span>
        )
    }

    /*
     * Initialization stuff for the image
     */
    init(uuid, recordingUrl) {
        var image = document.getElementById("image_" + uuid);
        if (image) {
            this.playButton(uuid, recordingUrl);
        } else {
            document.addEventListener('DOMContentLoaded', function () {
                this.playButton(uuid, recordingUrl);
            });
        }
    }

    /*
     * Get all the play button stuff setup
     */
    playButton(uuid, recordingUrl) {
        var audio = document.createElement('audio');
        var playback = document.getElementById("playback_" + uuid);
        var image = document.getElementById("image_" + uuid);
        audio.src = recordingUrl;

        function onPlayFinished() {
            playback.setAttribute("style", "display: none;");
            image.setAttribute("style", "display: inline-block;");
            image.focus();
        }

        function onPlay() {
            image.setAttribute("style", "display: none;");
            playback.setAttribute("style", "display: inline-block;");
            setTimeout(onPlayFinished, audio.duration * 1000);
        }

        function onPlayClicked() {
            audio.play().then(onPlay);
        }

        function playOnKeyup (event) {
           if (event.keyCode === 32) {
             event.preventDefault();
             onPlayClicked();
           }
        }

        function playOnKeydown (event) {
          // The action button is activated by space on the keyup event, but the
          // default action for space is already triggered on keydown. It needs to be
          // prevented to stop scrolling the page before activating the button.
          if (event.keyCode === 32) {
            event.preventDefault();
          }
          // If enter is pressed, activate the button
          else if (event.keyCode === 13) {
            event.preventDefault();
            onPlayClicked();
          }
        }

        playback.setAttribute("style", "display: none;");
        image.addEventListener('click', onPlayClicked);
        image.addEventListener('keydown', playOnKeydown);
        image.addEventListener('keyup', playOnKeyup);
    }
}

export default NameCoach
