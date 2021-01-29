import React from 'react';
import 'rivet-clearable-input/dist/css/rivet-clearable-input.min.css';
import ClearableInput from 'rivet-clearable-input/dist/js/rivet-clearable-input.js';

class UserSearch extends React.Component {

  constructor () {
    super()

    //Bind the search method so that it works with the listener added from componentDidMount
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    //Initialize the clearable input
    ClearableInput.init()
    //Setup the listener for then the text is cleared
    window.addEventListener('inputCleared', this.handleSearch);
  }

  componentWillUnmount() {
      window.removeEventListener('inputCleared', this.handleSearch);
  }

  handleSearch(event) {
    var input = document.getElementById('search');
    var inputValue = input.value;

    this.props.searchPeople(inputValue);
  }

  handleKeyPress(event) {
    if (event.key == 'Enter') {
        this.handleSearch(event);
    }
  }

  render() {

    return (
        <div className="rvt-p-top-xs rvt-m-right-sm-md-up">
            <label htmlFor="search" className="rvt-sr-only">Search</label>
            <div className="rvt-input-group clear-field">
                <div className="rvt-clearable-input-group search-input">
                    <input className="rvt-input-group__input transparencyOverride rvt-clearable-input search-input"
                        type="text" id="search" placeholder="Enter name or username" onKeyPress={this.handleKeyPress.bind(this)} />
                </div>
                <div className="rvt-input-group__append">
                    <button id="searchSubmit" className="rvt-button rvt-button--secondary transparencyOverride" onClick={this.handleSearch.bind(this)}>Search</button>
                </div>
            </div>
        </div>
    )
  }
}

export default UserSearch;