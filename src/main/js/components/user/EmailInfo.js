import React from 'react'

const EmailInfo = (props) => {
    var email = props.email;
    //    console.log(email)
    if (props.email) {
        return (
            <div className="email">
                <a href={"mailto:" + email} title={`Send email to ${props.srName}`} className="textOverflow person_email rvt-ts-xs">{email}</a>
            </div>
        )
    } else {
        return null;
    }
}

export default EmailInfo