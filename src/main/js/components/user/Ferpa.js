import React from 'react'

const Ferpa = (props) => {
    if (props.ferpaRendered) {
        if (props.modal) {
            return <div className={`ferpa rvt-text-bold rvt-display-flex rvt-vertical-center ferpaModalOverride ferpa-${props.imageKey}`} >FERPA</div>
        } else {
            return <div className="ferpa rvt-text-center rvt-ts-12 rvt-text-bold rvt-lh-title">FERPA</div>
        }
    } else {
        return null;
    }
}

export default Ferpa