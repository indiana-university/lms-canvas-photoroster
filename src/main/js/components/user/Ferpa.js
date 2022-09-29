import React from 'react'

const Ferpa = (props) => {
    if (props.ferpaRendered) {
        if (props.modal) {
            return <div className={`rvt-flex ferpa rvt-text-bold ferpaModalOverride ferpa-${props.imageKey}`} >FERPA</div>
        } else {
            return <div className="ferpa rvt-text-center rvt-ts-12 rvt-text-bold">FERPA</div>
        }
    } else {
        return null;
    }
}

export default Ferpa