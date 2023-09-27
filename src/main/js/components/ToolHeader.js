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
import React from 'react';
import ExportModal from 'components/ExportModal'

class ToolHeader extends React.Component {

  constructor(props) {
    super(props);
  }

  printRoster() {
    window.print();
  }

  render() {
    var exportMarkup = "";
    if (this.props.showExport) {
        exportMarkup = (
            <div className="rvt-p-right-xs ie11CursorOverride" title="Download">
                <button id="downloadRosterOption" className="view-option rvt-button rvt-button--secondary" data-rvt-dialog-trigger="export-options-modal">
                   <img alt="Download roster as csv" src={imageBase + "download.svg"} width="24" height="24" className="pointerEventOverride"></img>
                </button>
            </div>
        )
    }

    return (
        <div id="toolHeader" className="rvt-container-xl">
            <div className="rvt-flex rvt-items-center rvt-p-top-sm">
                <div className="rvt-p-right-sm">
                    <h1 className="rvt-ts-36">IU Photo Roster</h1>
                </div>
                <div className="rvt-p-right-xs ie11CursorOverride" title="Print">
                    <button className="view-option rvt-button rvt-button--plain" id="printRosterOption" onClick={this.printRoster}>
                        <img alt="Print roster" src={imageBase + "print.svg"} width="24" height="24" className="pointerEventOverride"></img>
                    </button>
                </div>
                {exportMarkup}
                <div className="rvt-p-right-xs ie11CursorOverride" title="Open in New Window">
                    <a href={`/app/${window.config.courseid}`} id="newWindowOption" target="_blank" className="svgObjectHelper">
                        <img alt="Open roster in new window" src={imageBase + "newWindow.svg"} width="24" height="24" className="pointerEventOverride"></img>
                    </a>
                </div>
            </div>
            <ExportModal groups={this.props.groups} exportOptions={this.props.exportOptions} exportData={this.props.exportData}
                exportHeadings={this.props.exportHeadings} changeExportOptions={this.props.changeExportOptions} transformDataForExport={this.props.transformDataForExport} />
        </div>

    )
  }
}

export default ToolHeader;
