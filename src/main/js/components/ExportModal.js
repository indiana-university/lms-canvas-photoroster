/*-
 * #%L
 * photoroster
 * %%
 * Copyright (C) 2015 - 2022 Indiana University
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
import { EXPORT_OPTIONS } from 'utils/Constants'
import dateformat from 'dateformat'
import { CSVLink } from "react-csv"


class ExportModal extends React.Component {

    constructor(props) {
        super(props);
//        this.props = props;
//        this.exportCsv.bind(this);
//        this.handleExportOption.bind(this);
    }

//    componentDidMount() {
//        /* Rivet2 and react don't play well together in modals, so trying to do this stuff here */
//
//        // submit button making sure something is checked and prevent csv download if not
//        const submitButton = document.getElementById('csv-submit-button');
//        submitButton.addEventListener('click', this.exportCsv);
//
//        // checkboxes for monitoring change and updating columns to pass for the csv
//        // this one is conditional
//        if (this.props.groups && this.props.groups.length > 0) {
//            const checkboxGroup = document.getElementById('csv-group');
//            checkboxGroup.addEventListener('change', this.handleExportOption);
//        }
//
//        const checkboxSortName = document.getElementById('csv-sort-name');
//        checkboxSortName.addEventListener('change', this.handleExportOption);
//
//        const checkboxEmail = document.getElementById('csv-email');
//        checkboxEmail.addEventListener('change', this.handleExportOption);
//
//        const checkboxUsername = document.getElementById('csv-username');
//        checkboxUsername.addEventListener('change', this.handleExportOption);
//
//        const checkboxRole = document.getElementById('csv-role');
//        checkboxRole.addEventListener('change', this.handleExportOption);
//
//        const checkboxSection = document.getElementById('csv-section');
//        checkboxSection.addEventListener('change', this.handleExportOption);
//    }

    render() {
        var date = dateformat(new Date(), "yyyy-mm-dd");
        var filename = "PhotoRoster_" + window.config.courseid + "_" + date + ".csv";

        var groupOption = "";
        if (this.props.groups && this.props.groups.length > 0) {
            groupOption = (
                <li>
                    <div class="rvt-checkbox">
                        <input type="checkbox" onChange={this.handleExportOption.bind(this)} name="csv-option"
                            id="csv-group" value={EXPORT_OPTIONS.group} checked={this.optionChecked(EXPORT_OPTIONS.group)}/>
                        <label htmlFor="csv-group" className="rvt-m-right-sm">Canvas group(s)</label>
                    </div>
                </li>
            )
        }

        return (
            <div className="rvt-dialog"
                 id="export-options-modal"
                 role="dialog"
                 tabIndex="-1"
                 aria-labelledby="export-options-modal-title"
                 data-rvt-dialog="export-options-modal"
                 data-rvt-dialog-modal
                 data-rvt-dialog-darken-page
                 data-rvt-dialog-disable-page-interaction
                 hidden>
                    <header className="rvt-dialog__header">
                        <h1 className="rvt-dialog__title" id="export-options-modal-title">CSV Export</h1>
                    </header>
                    <div className="rvt-dialog__body">
                        <div id="csv-option-error" className="rvt-display-none rvt-alert rvt-alert--danger" role="alert" aria-labelledby="danger-alert-title" data-rvt-alert="error">
                            <h1 className="rvt-alert__title" id="danger-alert-title">Export Error</h1>
                            <p className="rvt-alert__message">You must select at least one field.</p>
                        </div>
                        <fieldset className="rvt-fieldset">
                            <legend className="rvt-p-tb-xs">Select the fields to include in the CSV export:</legend>
                            <ul className="rvt-list-plain rvt-m-left-sm">
                                <li>
                                    <div class="rvt-checkbox">
                                        <input type="checkbox" onChange={this.handleExportOption.bind(this)} name="csv-option"
                                            id="csv-sort-name" value={EXPORT_OPTIONS.sortable_name} checked={this.optionChecked(EXPORT_OPTIONS.sortable_name)} />
                                        <label htmlFor="csv-sort-name" className="rvt-m-right-sm">Sortable name</label>
                                    </div>
                                </li>
                                <li>
                                    <div class="rvt-checkbox">
                                        <input type="checkbox" onChange={this.handleExportOption.bind(this)} name="csv-option"
                                            id="csv-email" value={EXPORT_OPTIONS.email} checked={this.optionChecked(EXPORT_OPTIONS.email)} />
                                        <label htmlFor="csv-email" className="rvt-m-right-sm">Email address</label>
                                    </div>
                                </li>
                                <li>
                                    <div class="rvt-checkbox">
                                        <input type="checkbox" onChange={this.handleExportOption.bind(this)} name="csv-option"
                                            id="csv-username" value={EXPORT_OPTIONS.login_id} checked={this.optionChecked(EXPORT_OPTIONS.login_id)} />
                                        <label htmlFor="csv-username" className="rvt-m-right-sm">Username</label>
                                    </div>
                                </li>
                                <li>
                                    <div class="rvt-checkbox">
                                        <input type="checkbox" onChange={this.handleExportOption.bind(this)} name="csv-option"
                                            id="csv-role" value={EXPORT_OPTIONS.role} checked={this.optionChecked(EXPORT_OPTIONS.role)} />
                                        <label htmlFor="csv-role" className="rvt-m-right-sm">Canvas role(s)</label>
                                    </div>
                                </li>
                                <li>
                                    <div class="rvt-checkbox">
                                        <input type="checkbox" onChange={this.handleExportOption.bind(this)} name="csv-option"
                                            id="csv-section" value={EXPORT_OPTIONS.sectionName} checked={this.optionChecked(EXPORT_OPTIONS.sectionName)} />
                                        <label htmlFor="csv-section" className="rvt-m-right-sm">Canvas section(s)</label>
                                    </div>
                                </li>
                                {groupOption}
                            </ul>
                        </fieldset>
                    </div>
                    <div className="rvt-dialog__controls">
                        <CSVLink id="csv-submit-button" onClick={this.exportCsv.bind(this)} data={this.props.exportData} headers={this.props.exportHeaders} filename={filename} target="_blank"
                            role="button" className="rvt-button">
                          Submit
                        </CSVLink>
                        <button type="button" className="rvt-button rvt-button--secondary" data-rvt-dialog-close="export-options-modal">Cancel</button>
                    </div>
                    <button class="rvt-button rvt-button--plain rvt-dialog__close" data-rvt-dialog-close="export-options-modal" role="button">
                        <span class="rvt-sr-only">Close</span>
                        <svg fill="currentColor" width="16" height="16" viewBox="0 0 16 16"><path d="m3.5 2.086 4.5 4.5 4.5-4.5L13.914 3.5 9.414 8l4.5 4.5-1.414 1.414-4.5-4.5-4.5 4.5L2.086 12.5l4.5-4.5-4.5-4.5L3.5 2.086Z"></path></svg>
                    </button>
            </div>
        );
    }

    handleExportOption(event) {
        if (event.target.checked) {
            $("#csv-option-error").addClass("rvt-display-none")
        }

        var data = {id: event.target.value, checked: event.target.checked}
        this.props.changeExportOptions(data);
    }

    optionChecked(option) {
        return this.props.exportOptions && this.props.exportOptions.indexOf(option) != -1;
    }

    exportCsv(event) {
        // display error if no options have been checked
        if ($("input[name=csv-option]:checked").length < 1) {
            $("#csv-option-error").removeClass("rvt-display-none");
            event.preventDefault();
            return;
        }

        // this bit needs to be changed
        Modal.close('export-options-modal');
    }

}


export default ExportModal;
