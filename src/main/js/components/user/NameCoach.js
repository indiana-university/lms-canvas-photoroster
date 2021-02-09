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
                        <img className="logo-sign" src="https://www.name-coach.com/images/animate.gif" width="20" />
                    </span>
                    <img id={`image_${this.state.uuid}`} role="button" tabIndex="0" alt="Pronounce name" src="https://www.name-coach.com/images/spkr2.jpg" width="20" />
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