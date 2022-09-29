import React, { Component } from 'react'
import { EXPORT_OPTIONS } from 'utils/Constants'
import dateformat from 'dateformat'
import { CSVLink } from "react-csv"


class ExportModal extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        var date = dateformat(new Date(), "yyyy-mm-dd");
        var filename = "PhotoRoster_" + window.config.courseid + "_" + date + ".csv";

        var groupOption = "";
        if (this.props.groups && this.props.groups.length > 0) {
            groupOption = (
                <li>
                    <input type="checkbox" onChange={this.handleExportOption.bind(this)} name="csv-option"
                        id="csv-group" value={EXPORT_OPTIONS.group} checked={this.optionChecked(EXPORT_OPTIONS.group)}/>
                    <label htmlFor="csv-group" className="rvt-m-right-sm">Canvas group(s)</label>
                </li>
            )
        }

        return (
            <div className="rvt-dialog"
                 id="export-options-modal"
                 role="dialog"
                 aria-labelledby="export-options-modal-title"
                 aria-hidden="true"
                 tabIndex="-1"
                 data-rvt-dialog="export-options-modal"
                 data-rvt-dialog-darken-page
                 hidden>
                <header className="rvt-dialog__header">
                    <h1 className="rvt-dialog__title" id="export-options-modal-title">CSV Export</h1>
                </header>
                <div className="rvt-dialog__body">
                    <div id="csv-option-error" className="rvt-display-none rvt-alert rvt-alert--danger" role="alert"
                      aria-labelledby="danger-alert-title" data-rvt-alert="error">
                        <div className="rvt-alert__title" id="danger-alert-title">Export Error</div>
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
                                        id="csv-username" value={EXPORT_OPTIONS.login_id} checked={this.optionChecked(EXPORT_OPTIONS.login_id)}/>
                                    <label htmlFor="csv-username" className="rvt-m-right-sm">Username</label>
                                </div>
                            </li>
                            <li>
                                <div class="rvt-checkbox">
                                    <input type="checkbox" onChange={this.handleExportOption.bind(this)} name="csv-option"
                                        id="csv-role" value={EXPORT_OPTIONS.role} checked={this.optionChecked(EXPORT_OPTIONS.role)}/>
                                    <label htmlFor="csv-role" className="rvt-m-right-sm">Canvas role(s)</label>
                                </div>
                            </li>
                            <li>
                                <div class="rvt-checkbox">
                                    <input type="checkbox" onChange={this.handleExportOption.bind(this)} name="csv-option"
                                        id="csv-section" value={EXPORT_OPTIONS.sectionName} checked={this.optionChecked(EXPORT_OPTIONS.sectionName)}/>
                                    <label htmlFor="csv-section" className="rvt-m-right-sm">Canvas section(s)</label>
                                </div>
                            </li>
                            {groupOption}
                        </ul>
                    </fieldset>
                    <div className="rvt-dialog__controls rvt-m-top-sm">
                        <CSVLink onClick={this.exportCsv.bind(this)} data={this.props.exportData} headers={this.props.exportHeaders} filename={filename} target="_blank"
                            role="button" className="rvt-button">
                          Submit
                        </CSVLink>
                        <button type="button" className="rvt-button rvt-button--secondary" data-rvt-dialog-close="export-options-modal">Cancel</button>
                    </div>
                    <button type="button" className="rvt-button rvt-dialog__close" data-rvt-dialog-close="export-options-modal">
                        <span className="rvt-sr-only">Close</span>
                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                            <path fill="currentColor" d="M9.41,8l5.29-5.29a1,1,0,0,0-1.41-1.41L8,6.59,2.71,1.29A1,1,0,0,0,1.29,2.71L6.59,8,1.29,13.29a1,1,0,1,0,1.41,1.41L8,9.41l5.29,5.29a1,1,0,0,0,1.41-1.41Z"/>
                        </svg>
                    </button>
                </div>
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

        Modal.close('export-options-modal');
    }

}


export default ExportModal;