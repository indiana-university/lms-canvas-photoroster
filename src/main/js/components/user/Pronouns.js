import React from 'react'

const Pronouns = (props) => {
    var pronouns = props.pronouns;
    if (props.inModal) {
        pronouns = "Pronouns: " + pronouns
    }

    if (props.pronouns) {
        return (
            <div className="rvt-ts-14 rvt-p-bottom-xxs">     
                { !props.inModal && <span className="sr-only keep-whitespace">Pronouns </span> }
                {pronouns}
            </div>
        )
    } else {
        return null;
    }
}

export default Pronouns