import React from 'react'
//import LinesEllipsis from 'react-lines-ellipsis'
import NameCoach from './NameCoach'

const Name = (props) => {

    var additionalClasses = "rvt-text-bold "
    if (props.inModal) {
        additionalClasses += "forceWrap"
    } else {
        additionalClasses += "textOverflow"
    }

    const name1 = <span className={`${additionalClasses}`} title={`${props.displayName}`}>{props.displayName}</span>

//    const name2 = <LinesEllipsis
//                          component="span"
//                          className="rvt-text-bold"
//                          title={`${props.displayName}`}
//                          text={props.displayName}
//                          basedOn='letters'
//                          maxLine={2} />

//    return (<div className="rvt-container hover-over">
//        <div className="rvt-grid">
//            <div className="rvt-grid__item-2-md-up">&nbsp;</div>
//            <div className="rvt-grid__item-8-md-up">
//                {name1}
//            </div>
//            <div className="rvt-grid__item-2-md-up">
//                <NameCoach namecoach={props.namecoach}/>
//            </div>
//        </div>
//    </div>)

    return (
        <div>
            <div className="name-wrapper">{name1}</div>
            <NameCoach inModal={props.inModal} recordingUrl={props.recordingUrl}/>
        </div>
    )

}

export default Name