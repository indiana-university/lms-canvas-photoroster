import React from 'react'
import styled from 'styled-components'
import axios from 'axios'

import Users from 'containers/Users'
import UsersGrouped from 'containers/UsersGrouped'
import ActionBar from 'containers/ActionBar'
import ToolHeader from 'components/ToolHeader'
import UserModal from 'components/UserModal'
import Loading from 'components/Loading'
import ErrorMessages from 'components/ErrorMessages'
import {CircleArrow as ScrollUpButton} from 'react-scroll-up-button';

import { mapValues, groupBy, chain, join, uniq, sortBy } from 'lodash';

import { VIEW_MODES, IMAGE_MODES, GROUPING_BY, EXPORT_OPTIONS } from 'utils/Constants'
import { convertGroupIdsToNames, caseInsensitiveSort } from 'utils/Helper'

class App extends React.Component {
  /**
    * Initialization stuff
    */
  constructor() {
    super()

    // Set the x-auth-token head for all requests
    // The customId value got ijected in to the react.html file and is a global variable
    axios.defaults.headers.common['X-Auth-Token'] = customId;

    this.state = {
        users: [],
        allUsers: [],
        enrollments: [],
        allEnrollments: [],
        sections: [],
        groups: [],
        roles: [],
        peopleFilter: {
            "searchTerms": "",
            "filteredRoles": [],
            "filteredSections": [],
            "filteredGroups": []
        },
        peopleGrouping: GROUPING_BY.noGroup,
        loading: true,
        view_mode: VIEW_MODES.grid,
        image_mode: IMAGE_MODES.iu_small,
        permissions: {
            canSeeExport: false,
            canSeeSigninView: false,
            canSeeFerpa: false,
            canSeeOfficialPhotos: false
        },
        error_messages: [],
        exportOptions: [],
        exportHeadings: [],
        exportData: []
    }
  }

  /**
   * Call off to the REST endpoints to load data
   * Also set a listener for cleaning up the modal after close
   */
  componentDidMount(){
  var self = this;
    axios.all([getSections(), getGroups(), getBackingModel()])
        .then(axios.spread(function (sects, grps, backing) {
            var userData = getUsers(backing.data);
            var enrollmentData = getEnrollments(backing.data);
            var roleFilters = []
            var sectFilters = []
            var groupFilters = []

            var permissions = backing.data.permissionsModel;

            //Defaults to canvas images
            var imageMode = IMAGE_MODES.canvas;
            if (permissions.canSeeOfficialPhotos) {
                imageMode = IMAGE_MODES.iu_small
            }

            self.setState({
                users: userData,
                allUsers: userData,
                enrollments: enrollmentData,
                allEnrollments: enrollmentData,
                sections: sects.data,
                groups: grps.data,
                peopleGrouping: GROUPING_BY.noGroup,
                roles: getRolesFromEnrollments(enrollmentData),
                loading: false,
                emptyUser: backing.data.emptyUser,
                courseTitle: backing.data.courseTitle,
                permissions: permissions,
                image_mode: imageMode,
                error_messages: backing.data.errorMessages,
                peopleFilter: {
                            "searchTerms": "",
                            "filteredRoles": roleFilters,
                            "filteredSections": sectFilters,
                            "filteredGroups": groupFilters
                        }
            });
        }))
        .catch(error => {
            alert(error);
        });

    // clear the image on modal close
    document.addEventListener('modalClose', event => {
        if (event.detail.name() === 'modal-card-popup') {
            this.setState({modalUser: this.state.emptyUser, modalEnrollments: []})

            // There is only one modal, but rivet expects a unique modal for each
            // user card. To return focus to the correct user card when the modal
            // is closed, we need to set the card's data-modal-trigger attribute
            // to a unique value and manually focus the modal. We will re-set to the
            // generic data-modal-trigger the next time a card is clicked
            var trigger = document.getElementById(this.state.modalTrigger)
            trigger.setAttribute("data-modal-trigger", "modal-card-popup-temp")
            Modal.focusTrigger("modal-card-popup-temp")
        }
    }, false);

    // clear the export options on modal close
    document.addEventListener('modalClose', event => {
        if (event.detail.name() === 'export-options-modal') {
            this.setState({exportOptions: []});
            $("#csv-option-error").addClass("rvt-display-none")
        }
    }, false);
  }

  /**
   * Render
   */
  render() {
    var filteredUsers = this.state.users
    var filteredEnrollments = this.state.enrollments

    // uses lodash `mapValues` and `groupBy`
    var nest = function (seq, keys) {
        if (!keys.length)
            return seq;
        var first = keys[0];
        var rest = keys.slice(1);
        return _.mapValues(_.groupBy(seq, first), function (value) {
            return nest(value, rest)
        });
    };

    var nestByGroup = function (filteredGroupIds, enrollments) {
        let groupToEnrMap = [];
        if (filteredGroupIds.length > 0) {
            filteredGroupIds.forEach(function (groupId) {
                var groupEnrollments = getGroupEnrollments(groupId, enrollments)
                if (groupEnrollments && groupEnrollments.length > 0) {
            	    groupToEnrMap[groupId] = getGroupEnrollments(groupId, enrollments);
            	}
            });
        }

        return groupToEnrMap;
    };

    function getGroupEnrollments(groupId, allEnrollments) {
        return allEnrollments.filter((enr) => {
            return enr.groupMemberships.indexOf(groupId) != -1;
        })
    }

    var mappedEnrollments = {}

    // text for screenreader-only heading to announce current view
    var viewHeadingText;
    if (VIEW_MODES.signIn === this.state.view_mode) {
        viewHeadingText = 'Sign-in sheet view of roster ';
    } else {
        viewHeadingText =  this.state.view_mode + ' view of roster ';
    }

    let userList;
    const common_props = {loading: this.state.loading, view_mode: this.state.view_mode,
        users: filteredUsers, openModalMethod: this.imageClickOpenModal.bind(this),
        image_mode: this.state.image_mode, peopleGrouping: this.state.peopleGrouping};

    if (GROUPING_BY.role == this.state.peopleGrouping) {
        mappedEnrollments = nest(filteredEnrollments, ["roleType"]);
        var orderedEnrMapKeys = Object.keys(mappedEnrollments);
        userList = <UsersGrouped {...common_props} group1DataMap={this.state.roles} orderedEnrMapKeys={orderedEnrMapKeys} enrollmentMap={mappedEnrollments} allGroups={this.state.groups}/>
        viewHeadingText += ' grouped by role';
    } else if (GROUPING_BY.section == this.state.peopleGrouping) {
        mappedEnrollments = nest(filteredEnrollments, ["sectionId"]);
        var orderedEnrMapKeys = Object.keys(mappedEnrollments);
        userList = <UsersGrouped {...common_props} group1DataMap={this.state.sections} orderedEnrMapKeys={orderedEnrMapKeys} enrollmentMap={mappedEnrollments} allGroups={this.state.groups} />
        viewHeadingText += ' grouped by section';
    } else if (GROUPING_BY.group == this.state.peopleGrouping) {
        let groupIdNameMap = []
        this.state.groups.forEach(function (courseGroup) {
            groupIdNameMap[courseGroup.id] = courseGroup.name
        });

        // If there are no group filters, we include all groups
        var filteredGroupIds = [];
        if (this.state.peopleFilter.filteredGroups && this.state.peopleFilter.filteredGroups.length > 0) {
            filteredGroupIds = this.state.peopleFilter.filteredGroups
        } else {
            filteredGroupIds = this.state.groups.map(g => g.id)
        }

        mappedEnrollments = nestByGroup(filteredGroupIds, filteredEnrollments)

        // The groups are ordered by group name, so filter this list to only the
        // groups that are in the mapped enrollments
        var orderedEnrMapKeys = this.state.groups.filter(g => Object.keys(mappedEnrollments).indexOf(g.id) != -1).map(g => g.id)
        userList = <UsersGrouped {...common_props} group1DataMap={groupIdNameMap} orderedEnrMapKeys={orderedEnrMapKeys} enrollmentMap={mappedEnrollments} allGroups={this.state.groups} />
        viewHeadingText += ' grouped by course groups';
    } else {
        // default to no grouping
        userList = <Users {...common_props} enrollmentData={filteredEnrollments} allGroups={this.state.groups} />
    }

    if (this.state.permissions.canSeeOfficialPhotos && this.state.view_mode !== VIEW_MODES.signIn) {
        var photoInfo = "";
         if (this.state.image_mode === IMAGE_MODES.canvas) {
            photoInfo += "Canvas photos";
         } else if (this.state.image_mode === IMAGE_MODES.iu_medium) {
            photoInfo += "medium-sized official IU photos";
         } else {
            photoInfo += "small-sized official IU photos";
         }
        viewHeadingText += " with " + photoInfo;
    }

    var totalUsersText = "";
    if (this.state.users) {
        const totalText = this.state.users.length == 1 ? ' participant ' : ' participants ';
        totalUsersText = this.state.users.length + totalText + 'displayed';
    }


    if (this.state.loading) {
        return (
            <Loading loading={this.state.loading} />
        )
    } else {
        return (
            <div>
                <ToolHeader users={filteredUsers} enrollments={filteredEnrollments} showExport={this.state.permissions.canSeeExport}
                    groups={this.state.groups} changeExportOptions={this.changeExportOptions.bind(this)}
                    exportOptions={this.state.exportOptions} exportData={this.state.exportData} exportHeadings={this.state.exportHeadings} />
                <div id="printHeader" className="rvt-container">
                    <h1 className="rvt-ts-29">{this.state.courseTitle}</h1>
                </div>
                <ErrorMessages messages={this.state.error_messages} />
                <div className="rvt-container" id="main-container" data-urlbase="@{|/photoroster/${course.id}/|}">
                    <div id="content-container" className="rvt-box overrideBoxColor">
                        <div className="rvt-box__body">
                            <ActionBar roles={this.state.roles} sections={this.state.sections} groups={this.state.groups} searchPeople={this.searchPeople.bind(this)}
                                changePhotoOptions={this.changePhotoOptions.bind(this)} peopleGrouping={this.state.peopleGrouping} groupPeople={this.groupPeople.bind(this)}
                                filterPeople={this.filterPeople.bind(this)} view_mode={this.state.view_mode} changeView={this.changeView.bind(this)}
                                image_mode={this.state.image_mode}
                                showSignInView={this.state.permissions.canSeeSigninView}
                                showPhotoOptions={this.state.permissions.canSeeOfficialPhotos}
                                radioDropdownNavigation={this.radioDropdownNavigation.bind(this)}
                                radioDropdownOpening={this.radioDropdownOpening.bind(this)} />
                            <SearchResults resultsCount={filteredUsers.length} searchTerm={this.state.peopleFilter.searchTerms} />
                            <h2 className="sr-only" aria-live="polite">{viewHeadingText}</h2>
                            <div id="totalUsers" className="sr-only" aria-live="polite">{totalUsersText}</div>
                            <Loading loading={this.state.loading} />
                            {userList}
                        </div>
                    </div>
                </div>
                <UserModal modalUser={this.state.modalUser} modalEnrollments={this.state.modalEnrollments}
                    image_mode={this.state.image_mode} allGroups={this.state.groups}/>
                <ScrollUpButton />
            </div>
        );
    }
  }


applySearchAndFilter() {
    var filterValues = this.state.peopleFilter;

    let filteredSectionEnrollments = []
    let filteredRoleEnrollments = []
    let filteredGroupEnrollments = []

    let filteredEnrollments = this.state.allEnrollments

    //Filter on search values
    var query = filterValues.searchTerms.toUpperCase();
    let filteredUsers = this.state.allUsers.filter((userModel) => {
        return (userModel.user.sortable_name && userModel.user.sortable_name.toUpperCase().includes(query)) ||
          ( userModel.user.login_id && userModel.user.login_id.toUpperCase().includes(query))
    });

    //Get just the UserIds of the filtered users
    var filteredUserIds = _.chain(filteredUsers)
        .map('user.id')
        .value();

    //Filter on section filter values
    if (filterValues.filteredSections.length > 0) {
        filteredEnrollments = filteredEnrollments.filter((enrollmentModel) => {
            return filterValues.filteredSections.indexOf(enrollmentModel.sectionId) !== -1
        });
    }

    //Filter on role filter values
    if (filterValues.filteredRoles.length > 0) {
        filteredEnrollments = filteredEnrollments.filter((enrollmentModel) => {
            return filterValues.filteredRoles.indexOf(enrollmentModel.roleType) !== -1
        });
    }

     //Filter on group filter values
    if (filterValues.filteredGroups.length > 0) {
        filteredEnrollments = filteredEnrollments.filter((enrModel) => {
            if(enrModel.groupMemberships.length > 0 && enrModel.groupMemberships.filter((groupId) => {
                 if(filterValues.filteredGroups.indexOf(groupId) !== -1) {
                   return groupId
                 }
            }).length > 0){
                return enrModel;
            }
        });
    }

    // Further filter the users and enrollments together
    // Remove enrollments that are not in the filtered users
    filteredEnrollments = filteredEnrollments.filter((enrollmentModel) => {
        return filteredUserIds.indexOf(enrollmentModel.userId) !== -1
    });

    //Get just the UserIds of the filtered enrollments
    var filteredEnrollmentUserIds = _.chain(filteredEnrollments)
        .map('userId')
        .value();

    // Now, remove the users who are not in the filtered enrollments
    filteredUsers = filteredUsers.filter((personModel) => {
        return filteredEnrollmentUserIds.indexOf(personModel.user.id) !== -1
    });

    this.setState({users: filteredUsers})
    this.setState({enrollments: filteredEnrollments})
  }

    /**
     * Find the actual values that were checked in the filtering checkboxes
     */
    handleFiltering(data, options) {
      let index

      // check if the check box is checked or unchecked
      if (data.checked) {
        // add the numerical value of the checkbox to options array
        options.push(data.id)
      } else {
        // or remove the value from the unchecked checkbox from the array
        index = options.indexOf(data.id)
        options.splice(index, 1)
      }
      return options
    }

  /**
   * Determine the filtering data
   */
  filterPeople(sectionData, roleData, groupData, reset = false) {
    if (sectionData) {
        var sectionOptions = this.state.peopleFilter.filteredSections
        sectionOptions = this.handleFiltering(sectionData, sectionOptions)
        this.state.peopleFilter.filteredSections = sectionOptions
    }
    if (roleData) {
        var roleOptions = this.state.peopleFilter.filteredRoles
        roleOptions = this.handleFiltering(roleData, roleOptions)
        this.state.peopleFilter.filteredRoles = roleOptions
    }
    if (groupData) {
        var groupOptions = this.state.peopleFilter.filteredGroups
        groupOptions = this.handleFiltering(groupData, groupOptions)
        this.state.peopleFilter.filteredGroups = groupOptions
    }

    if (reset) {
        this.state.peopleFilter.filteredSections = []
        this.state.peopleFilter.filteredRoles = []
        this.state.peopleFilter.filteredGroups = []
    }

    this.applySearchAndFilter();
  }

  groupPeople(peopleGrouping) {
    this.setState({peopleGrouping: peopleGrouping})
    this.applySearchAndFilter();
  }

  /**
   * Determine the search query
   */
  searchPeople(query) {
    this.state.peopleFilter.searchTerms = query;
    this.applySearchAndFilter();
  }

  /**
   * Open the user modal
   */
  imageClickOpenModal(userId, triggerId) {
    //Find just the single user
    let filteredUsers = this.state.users.filter((userModel) => {
        return (userModel.user.id.includes(userId))
    });

    var theUser = filteredUsers[0];

    //Find only this user's enrollments
    let filteredEnrollments = this.state.enrollments.filter((enrollmentModel) => {
        return (enrollmentModel.userId.includes(userId))
    });

    this.setState({modalUser: theUser, modalEnrollments: filteredEnrollments, modalTrigger: triggerId})
  }

  /**
   * Change the view (grid, list, signIn)
   */
  changeView(viewName) {
    this.setState({view_mode: viewName});
  }

  /**
   * Change the image mode/size
   */
  changePhotoOptions(imageMode) {
    if (imageMode) {
        this.setState({image_mode: imageMode});
    }
  }

  /**
    * Change the selected export options
    */
  changeExportOptions(exportData) {
    var exportOptions = this.state.exportOptions
    exportOptions = this.handleFiltering(exportData, exportOptions)
    this.transformDataForExport()
  }

  /**
   * Generate the csv file based on the selected export options
   */
  transformDataForExport() {
    var exportOptions = this.state.exportOptions

    // roles are always concatenated, not a single entry for each
    // if groups, add record for each group membership
    // if groups and sections, concatenate sections, one record for each group
    // if sections but no groups, one record per section

    var processedData = [];
    var headings = [];
    if (exportOptions && exportOptions.length > 0) {
      var userToDetailsMap = new Map();
      this.state.enrollments.map((enr, index) => {
        var userEntry = {};
        if (userToDetailsMap.has(enr.userId)) {
            userEntry = userToDetailsMap.get(enr.userId)
        } else {
          // retrieve the user details
          const filteredUsers = this.state.users.filter((userModel) => {
              return (userModel.user.id.includes(enr.userId))
          });

          if (filteredUsers.length > 0) {
              var user = filteredUsers[0];
              userEntry[EXPORT_OPTIONS.sortable_name] = user.user.sortable_name;
              userEntry[EXPORT_OPTIONS.email] = user.user.email;
              userEntry[EXPORT_OPTIONS.login_id] = user.user.login_id;
          }

          userEntry['roles'] = []
          userEntry['section_names'] = []
          userEntry['group_names'] = []
        }

        // A user may have more than one role, section, or group, so we will collect them here
        var roles = userEntry['roles'];
        if (roles.indexOf(enr.roleName) == -1) {
            roles.push(enr.roleName)
        }
        userEntry['roles'] = roles

        var sectionNames = userEntry['section_names'];
        if (sectionNames.indexOf(enr.sectionName) == -1) {
            sectionNames.push(enr.sectionName);
        }
        sectionNames.sort(caseInsensitiveSort);
        userEntry['section_names'] = sectionNames;

        if (this.state.groups && this.state.groups.length > 0) {
            let groupMemberships = enr.groupMemberships
            let filteredGroups = this.state.peopleFilter.filteredGroups
            // if the roster is filtered by group, only include the filtered groups in the export
            if(filteredGroups && filteredGroups.length > 0) {
               groupMemberships = groupMemberships.filter((groupId) => {
                   return filteredGroups.indexOf(groupId) != -1;
               })
            }

            userEntry['group_names'] = convertGroupIdsToNames(groupMemberships, this.state.groups, true)
        }

        userToDetailsMap.set(enr.userId, userEntry);

      })

      userToDetailsMap.forEach(function(userDetails, userId) {
        var csvData = {};
        if (exportOptions.indexOf(EXPORT_OPTIONS.sortable_name) != -1) {
            csvData[EXPORT_OPTIONS.sortable_name] = userDetails[EXPORT_OPTIONS.sortable_name]
        }
        if (exportOptions.indexOf(EXPORT_OPTIONS.email) != -1) {
            csvData[EXPORT_OPTIONS.email] = userDetails[EXPORT_OPTIONS.email]
        }
        if (exportOptions.indexOf(EXPORT_OPTIONS.login_id) != -1) {
            csvData[EXPORT_OPTIONS.login_id] = userDetails[EXPORT_OPTIONS.login_id]
        }
        if (exportOptions.indexOf(EXPORT_OPTIONS.role) != -1) {
            csvData[EXPORT_OPTIONS.role] = join(userDetails['roles'], '; ')
        }

        // If groups are included in the export
        if (exportOptions.indexOf(EXPORT_OPTIONS.group) != -1) {
            // display sections as a semicolon-delimited list
            if (exportOptions.indexOf(EXPORT_OPTIONS.sectionName) != -1) {
                csvData[EXPORT_OPTIONS.sectionName] = join(userDetails['section_names'], '; ')
            }

            // If user is a member of at least one group, add a row for each group membership
            if (userDetails["group_names"] && userDetails["group_names"].length > 0) {
                userDetails["group_names"].forEach(function (groupName) {
                    var groupEntry = {}
                    Object.assign(groupEntry, csvData);
                    groupEntry[EXPORT_OPTIONS.group] = groupName
                    processedData.push(groupEntry)
                })
             } else {
                // user is not a member of any groups
                var groupEntry = {}
                Object.assign(groupEntry, csvData);
                groupEntry[EXPORT_OPTIONS.group] = ""
                processedData.push(groupEntry)
             }

        } else if (exportOptions.indexOf(EXPORT_OPTIONS.sectionName) != -1) {
            // display an entry for each section since groups aren't included in export
            userDetails['section_names'].forEach(function (sectionName) {
                var sectionEntry = {}
                Object.assign(sectionEntry, csvData);
                sectionEntry[EXPORT_OPTIONS.sectionName] = sectionName
                processedData.push(sectionEntry)
            })

        } else {
            processedData.push(csvData)
        }

      })

      // Add the export headers
      if (exportOptions.indexOf(EXPORT_OPTIONS.sortable_name) != -1) {
        headings.push({label: 'Sortable name', key: EXPORT_OPTIONS.sortable_name})
      }
      if (exportOptions.indexOf(EXPORT_OPTIONS.email) != -1) {
        headings.push({label: 'Email', key: EXPORT_OPTIONS.email})
      }
      if (exportOptions.indexOf(EXPORT_OPTIONS.login_id) != -1) {
        headings.push({label: 'Username', key: EXPORT_OPTIONS.login_id})
      }
      if (exportOptions.indexOf(EXPORT_OPTIONS.role) != -1) {
        headings.push({label: 'Canvas role(s)', key: EXPORT_OPTIONS.role})
      }
      if (exportOptions.indexOf(EXPORT_OPTIONS.sectionName) != -1) {
        headings.push({label: 'Canvas section(s)', key: EXPORT_OPTIONS.sectionName})
      }
      if (exportOptions.indexOf(EXPORT_OPTIONS.group) != -1) {
        headings.push({label: 'Canvas group(s)', key: EXPORT_OPTIONS.group})
      }

      // Default sort by name. If name is not included in export, sort by the first column
      var sortBy;
      if (exportOptions.indexOf(EXPORT_OPTIONS.sortable_name) != -1) {
        sortBy = EXPORT_OPTIONS.sortable_name;
      } else {
        sortBy = headings[0].key
      }

      processedData.sort(function(a, b){
          // sort alphabetically with nulls at the bottom
          return a[sortBy] ? a[sortBy].toLowerCase().localeCompare(b[sortBy].toLowerCase()) : 1;
      })
    }

    this.setState({exportData: processedData, exportHeadings: headings})
  }

  radioDropdownNavigation(event, dropdownId, radioGroupName, isGroupMenu) {

    // If it was a tab, we are moving out of the dropdown and need to close it
    // This is due to a bug in rivet dropdown that assumes all inputs are tabbable. This is not
    // the case for radio buttons which are navigated via arrow keys. If you are focused on the
    // first or second radio button in the group, tabbing out of the menu will not close it.
    if (event.keyCode == 9) {
        Dropdown.close(dropdownId);
    }

    // Rivet added key handlers to force nav with up/down arrows. However, radio buttons already navigate with up/down
    // natively, so Rivet's handler is causing non-standard behavior for radio button navigation. Let's
    // just prevent Rivet from doing any up/down handling with radio buttons in Firefox. Chrome does not
    // have this issue
    if(navigator.userAgent.indexOf("Firefox") != -1 ) {

        const UP = 38;
        const DOWN = 40;

        if (event.keyCode == UP || event.keyCode == DOWN) {
            // stop rivet's keyboard handling from happening and we will just handle it ourselves
            event.preventDefault();

            // we need to select the correct radio button. If we are at the top we have to select the
            // bottom and vice versa
            var radioInputs = document.getElementsByName(radioGroupName);
            var currSelection = event.target;
            var newSelectedIndex;

            for (var i=0; i < radioInputs.length; i++) {
                if (currSelection.id === radioInputs[i].id) {
                    if (event.keyCode == UP) {
                        if (i == 0) {
                            newSelectedIndex = radioInputs.length-1;
                        } else {
                            newSelectedIndex = i-1;
                        }
                    } else if (event.keyCode == DOWN) {
                        if (i == radioInputs.length-1) {
                            newSelectedIndex = 0;
                        } else {
                            newSelectedIndex = i+1;
                        }
                    }
                    break;
                }
            }

            radioInputs[newSelectedIndex].checked = true;
            var selectedOption = radioInputs[newSelectedIndex].value

            if (isGroupMenu) {
                this.groupPeople(selectedOption);
            } else {
                this.changePhotoOptions(selectedOption);
            }
        }
    }
  }

  radioDropdownOpening(event, radioGroupName, isGroupMenu) {
      if(navigator.userAgent.indexOf("Firefox") != -1 && event.keyCode == 40) {
          // when we use the down arrow to expand the menu, the focus should
          // move to the selected radio button
          event.preventDefault();

         var radioSelector = "input[name='" + radioGroupName + "']:checked";
         var selectedRadio = document.querySelector(radioSelector);
         selectedRadio.focus();
      }
  }
}

  function getUsers(backingData) {
    return backingData.personModelList;
  }

  function getEnrollments(backingData) {
    return backingData.enrollmentModelList;
  }

  function getBackingModel() {
    return axios.get(`/app/rest/people/${window.config.courseid}`);
  }

  function getSections() {
    return axios.get(`/app/rest/sections/${window.config.courseid}`);
  }

  function getGroups() {
    return axios.get(`/app/rest/groups/${window.config.courseid}`);
  }

  function getRolesFromEnrollments(enrollmentData) {
    var flattened = {};
    _.chain(enrollmentData)
        .groupBy('roleType')
        .map(function(v, i) {
            var roles = _.map(v, 'roleGroupName')
            flattened[i] = _.join(_.uniq(roles), ', ')
        })
        .value();
    return flattened;
  }

  function SearchResults(props) {
    if (props.searchTerm && props.resultsCount > 0) {
        var resultText = props.resultsCount == 1 ? " result " : " results ";
        let searchText = props.resultsCount + resultText + 'for search term "' + props.searchTerm + '"';
        return (
            <div className="rvt-ts-20 rvt-m-top-sm" aria-live="polite">{searchText}</div>
        )
    }

    return null;
  }

export default App
