import React from 'react'
import UserFilter from 'components/UserFilter'
import UserSearch from 'components/UserSearch'
import PhotoOptions from 'components/PhotoOptions'
import ViewActions from 'components/ViewActions'
import UserGrouping from 'components/UserGrouping'

const ActionBar = (props) => {
  return (
    <div className="actionBar">
        <UserFilter roles={props.roles} sections={props.sections} groups={props.groups} filterPeople={props.filterPeople} />
        <UserGrouping groups={props.groups} peopleGrouping={props.peopleGrouping} groupPeople={props.groupPeople} />
        <UserSearch searchPeople={props.searchPeople} />
        <div className="rvt-display-flex">
            <PhotoOptions changePhotoOptions={props.changePhotoOptions} image_mode={props.image_mode}
                showPhotoOptions={props.showPhotoOptions}/>
            <ViewActions view_mode={props.view_mode} changeView={props.changeView} showSignInView={props.showSignInView}/>
        </div>
    </div>
  )
}

export default ActionBar
