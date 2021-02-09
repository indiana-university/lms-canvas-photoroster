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
            <div className="rvt-modal"
                 id="export-options-modal"
                 role="dialog"
                 aria-labelledby="export-options-modal-title"
                 aria-hidden="true"
                 tabIndex="-1">
                 <div className="rvt-modal__inner">
                    <header className="rvt-modal__header">
                        <h1 className="rvt-modal__title" id="export-options-modal-title">CSV Export</h1>
                    </header>
                    <div className="rvt-modal__body">
                        <div id="csv-option-error" className="rvt-display-none rvt-alert rvt-alert--danger" role="alert" aria-labelledby="error-alert-title">
                            <h1 className="rvt-alert__title" id="danger-alert-title">Export Error</h1>
                            <p className="rvt-alert__message">You must select at least one field.</p>
                        </div>
                        <fieldset>
                            <legend className="rvt-p-tb-xs">Select the fields to include in the CSV export:</legend>
                            <ul className="rvt-plain-list rvt-m-left-sm">
                                <li>
                                    <input type="checkbox" onChange={this.handleExportOption.bind(this)} name="csv-option"
                                        id="csv-sort-name" value={EXPORT_OPTIONS.sortable_name} checked={this.optionChecked(EXPORT_OPTIONS.sortable_name)} />
                                    <label htmlFor="csv-sort-name" className="rvt-m-right-sm">Sortable name</label>
                                </li>
                                <li>
                                    <input type="checkbox" onChange={this.handleExportOption.bind(this)} name="csv-option"
                                        id="csv-email" value={EXPORT_OPTIONS.email} checked={this.optionChecked(EXPORT_OPTIONS.email)} />
                                    <label htmlFor="csv-email" className="rvt-m-right-sm">Email address</label>
                                </li>
                                <li>
                                    <input type="checkbox" onChange={this.handleExportOption.bind(this)} name="csv-option"
                                        id="csv-username" value={EXPORT_OPTIONS.login_id} checked={this.optionChecked(EXPORT_OPTIONS.login_id)}/>
                                    <label htmlFor="csv-username" className="rvt-m-right-sm">Username</label>
                                </li>
                                <li>
                                    <input type="checkbox" onChange={this.handleExportOption.bind(this)} name="csv-option"
                                        id="csv-role" value={EXPORT_OPTIONS.role} checked={this.optionChecked(EXPORT_OPTIONS.role)}/>
                                    <label htmlFor="csv-role" className="rvt-m-right-sm">Canvas role(s)</label>
                                </li>
                                <li>
                                    <input type="checkbox" onChange={this.handleExportOption.bind(this)} name="csv-option"
                                        id="csv-section" value={EXPORT_OPTIONS.sectionName} checked={this.optionChecked(EXPORT_OPTIONS.sectionName)}/>
                                    <label htmlFor="csv-section" className="rvt-m-right-sm">Canvas section(s)</label>
                                </li>
                                {groupOption}
                            </ul>
                        </fieldset>
                    </div>
                    <div className="rvt-modal__controls">
                        <CSVLink onClick={this.exportCsv.bind(this)} data={this.props.exportData} headers={this.props.exportHeaders} filename={filename} target="_blank"
                            role="button" className="rvt-button">
                          Submit
                        </CSVLink>
                        <button type="button" className="rvt-button rvt-button--secondary" data-modal-close="export-options-modal">Cancel</button>
                    </div>
                    <button type="button" className="rvt-button rvt-modal__close" data-modal-close="export-options-modal">
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