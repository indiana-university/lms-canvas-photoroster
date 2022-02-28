import React, { Component } from 'react'
import UserFilterGroups from 'components/UserFilterGroups'

class UserFilter extends React.Component {

    constructor(props) {
        super(props);
    }
    componentDidUpdate() {
        this.computeAndDisplayActiveFilters();
    }

    render() {
        const roles = Object.entries(this.props.roles).map(([key,value]) => (
            <li key={key}>
                <input type="checkbox" id={"role_" + key} name="rolesCheckboxes" className="filter-input"
                    value={`${key}`} onChange={this.handleRoleFiltering.bind(this)} data-text={value} />
                <label htmlFor={"role_" + key} className="rvt-m-right-sm rvt-text-nobr">{value}</label>
            </li>
          ))

          const sections = Object.entries(this.props.sections).map(([key,value]) => (
            <li key={key}>
                <input type="checkbox" id={"section_" + key} name="sectionsCheckboxes" className="filter-input"
                    value={`${key}`} onChange={this.handleSectionFiltering.bind(this)} data-text={value} />
                <label htmlFor={"section_" + key} className="rvt-m-right-sm rvt-text-nobr">{value}</label>
            </li>
          ))

      return (
        <div className="rvt-dropdown rvt-p-top-xs rvt-m-right-sm-md-up" role="region" aria-label="Controls for filtering participants in roster">
            <button id="rosterFiltering" className="rvt-button rvt-button--secondary transparencyOverride" data-dropdown-toggle="filterDropdown" aria-haspopup="true" aria-expanded="false">
                <span>Filter By <span id="filters-active"></span></span>
                <svg aria-hidden="true" className="rvt-m-left-xs" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                    <path fill="currentColor" d="M8,12.46a2,2,0,0,1-1.52-.7L1.24,5.65a1,1,0,1,1,1.52-1.3L8,10.46l5.24-6.11a1,1,0,0,1,1.52,1.3L9.52,11.76A2,2,0,0,1,8,12.46Z"/>
                </svg>
            </button>
            <div className="rvt-dropdown__menu overrideDropdownWidth" id="filterDropdown" aria-hidden="true">
                <button id="remove-filters" onClick={this.handleRemoveFilterClick.bind(this)}>Remove Filters</button>
                <div id="role-division">
                    <fieldset className="rvt-p-left-sm">
                        <legend className="rvt-text-bold rvt-p-tb-xs">Role</legend>
                        <ul className="rvt-plain-list">
                            {roles}
                        </ul>
                    </fieldset>
                </div>
                <div>
                    <fieldset className="rvt-p-left-sm">
                        <legend className="rvt-text-bold rvt-p-tb-xs">Sections</legend>
                        <ul className="rvt-plain-list">
                            {sections}
                        </ul>
                    </fieldset>
                </div>

                <UserFilterGroups groups={this.props.groups} handleGroupFiltering={this.handleGroupFiltering.bind(this)} />
            </div>
        </div>
    );
  }


   handleSectionFiltering(event) {
        var data = {id: event.target.value, checked: event.target.checked}
        this.props.filterPeople(data, null, null, null)
    }

   handleRoleFiltering(event) {
        var data = {id: event.target.value, checked: event.target.checked}
        this.props.filterPeople(null, data, null, null)
    }

    handleGroupFiltering(event) {
        var data = {id: event.target.value, checked: event.target.checked}
        this.props.filterPeople(null, null, data, null)
    }

    computeAndDisplayActiveFilters() {
        var checkedFilters = $(".filter-input:checked");
        var numberOfChecked = checkedFilters.length
        var newContent = ""

        var currentFilterInfo = $("#selectedFilterText");

        if (numberOfChecked == 0) {
            newContent = "";
            $("#remove-filters").hide()
            $("#role-division").addClass("hideRemoveAll");
            currentFilterInfo.html("No filters selected");
        } else {
            newContent = "(" + numberOfChecked + ")"
            $("#remove-filters").show()
            $("#role-division").removeClass("hideRemoveAll")

            let filterValues = [];
            checkedFilters.each(function( c ) {
                filterValues.push($(this).data("text"));
            });

            currentFilterInfo.html("Selected filters: " + filterValues.join());
        }

      	$("#filters-active").html(newContent)
    }

    handleRemoveFilterClick(event) {
        //Uncheck stuff, reset the UI and call the filter, passing the reset flag
        $(".filter-input").prop('checked', false)
        this.props.filterPeople(null, null, null, true)
    }
}
export default UserFilter
