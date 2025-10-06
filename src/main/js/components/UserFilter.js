/*-
 * #%L
 * photoroster
 * %%
 * Copyright (C) 2015 - 2025 Indiana University
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
                <div class="rvt-checkbox">
                    <input type="checkbox" id={"role_" + key} name="rolesCheckboxes" className="filter-input"
                        value={`${key}`} onChange={this.handleRoleFiltering.bind(this)} data-text={value} />
                    <label htmlFor={"role_" + key} className="rvt-m-right-sm rvt-text-nobr">{value}</label>
                </div>
            </li>
          ))

        const sections = Object.entries(this.props.sections).map(([key,value]) => (
            <li key={key}>
                <div class="rvt-checkbox">
                    <input type="checkbox" id={"section_" + key} name="sectionsCheckboxes" className="filter-input"
                        value={`${key}`} onChange={this.handleSectionFiltering.bind(this)} data-text={value} />
                    <label htmlFor={"section_" + key} className="rvt-m-right-sm rvt-text-nobr">{value}</label>
                </div>
            </li>
          ))

      return (
          <div className="rvt-dropdown rvt-p-top-xs rvt-m-right-sm-md-up" role="region" aria-label="Controls for filtering participants in roster" data-rvt-dropdown="dropdown-filter">
              <div id="selectedFilterText" className="rvt-sr-only" aria-live="polite"></div>
              <button id="rosterFiltering" type="button" class="rvt-button rvt-button--secondary transparencyOverride" data-rvt-dropdown-toggle="filter-options">
                  <span class="rvt-dropdown__toggle-text">Filter By <span id="filters-active"></span></span>
                  <svg aria-hidden="true" fill="currentColor" width="16" height="16" viewBox="0 0 16 16"><path d="m15.146 6.263-1.292-1.526L8 9.69 2.146 4.737.854 6.263 8 12.31l7.146-6.047Z"></path></svg>
              </button>
              <div id="filterDropdown" className="rvt-dropdown__menu" data-rvt-dropdown-menu="filter-options" hidden>
                  <button id="remove-filters" aria-describedby="filter-count" className="rvt-button rvt-button--secondary" onClick={this.handleRemoveFilterClick.bind(this)}>Remove Filters</button>
                  <span id="filter-count" className="rvt-sr-only">No filters currently selected</span>
                  <div id="role-division">
                      <fieldset className="rvt-fieldset rvt-p-left-sm">
                          <legend className="rvt-text-bold rvt-p-tb-xs">Role</legend>
                          <ul className="rvt-list-plain">
                              {roles}
                          </ul>
                      </fieldset>
                  </div>
                  <div>
                      <fieldset className="rvt-fieldset rvt-p-left-sm">
                          <legend className="rvt-text-bold rvt-p-tb-xs">Sections</legend>
                          <ul className="rvt-list-plain">
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
        var filterCountText = ""

        var currentFilterInfo = $("#selectedFilterText");

        if (numberOfChecked == 0) {
            newContent = "";
            currentFilterInfo.html("No filters selected");
            filterCountText = 'No filters currently selected'
        } else {
            newContent = "(" + numberOfChecked + ")"

            let filterValues = [];
            checkedFilters.each(function( c ) {
                filterValues.push($(this).data("text"));
            });

            currentFilterInfo.html("Selected filters: " + filterValues.join());

            let fv = numberOfChecked === 1 ? 'filter' : 'filters';
            filterCountText = numberOfChecked + ' ' + fv + ' currently selected';
        }

      	$("#filters-active").html(newContent)
      	$("#filter-count").html(filterCountText)
    }

    handleRemoveFilterClick(event) {
        //Uncheck stuff, reset the UI and call the filter, passing the reset flag
        $(".filter-input").prop('checked', false)
        this.props.filterPeople(null, null, null, true)
    }
}
export default UserFilter
