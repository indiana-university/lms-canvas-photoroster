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
                <button id="downloadRosterOption" className="view-option rvt-button rvt-button--secondary" data-modal-trigger="export-options-modal">
                   <img alt="Download roster as csv" src={imageBase + "download.svg"} width="24" height="24" className="pointerEventOverride"></img>
                </button>
            </div>
        )
    }

    return (
        <div id="toolHeader" className="rvt-container">
            <div className="rvt-display-flex rvt-vertical-center rvt-p-top-sm">
                <div className="rvt-p-right-sm">
                    <h1 className="rvt-ts-36">IU Photo Roster</h1>
                </div>
                <div className="rvt-p-right-xs ie11CursorOverride" title="Print">
                    <button className="view-option rvt-button rvt-button--secondary" id="printRosterOption" onClick={this.printRoster}>
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