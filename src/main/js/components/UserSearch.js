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
        <div role="search" className="rvt-p-top-xs rvt-m-right-sm-md-up">
            <label htmlFor="search" className="rvt-sr-only">Search</label>
            <div className="rvt-input-group clear-field">
                <div className="rvt-clearable-input-group search-input">
                    <input className="rvt-text-input rvt-input-group__input transparencyOverride rvt-clearable-input search-input"
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
