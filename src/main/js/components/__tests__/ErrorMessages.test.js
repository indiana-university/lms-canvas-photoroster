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
import React from "react";
import Enzyme, {shallow, mount, render} from "enzyme";

import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

Enzyme.configure({adapter: new Adapter()});

import ErrorMessages from "../ErrorMessages";

describe("ErrorMessages", () => {


    it("multiple messages", () => {

      let props = {
        messages: ['hi', 'bye']
      };

      const wrapper = mount(<ErrorMessages {...props} />);
      const lis = wrapper.find('li');

      expect(lis.length).toBe(2);

      const li1 = lis.at(0);
      expect(li1.find('div').find('h1').text()).toEqual('hi');

      const li2 = lis.at(1);
      expect(li2.find('div').find('h1').text()).toEqual('bye');
    });

    it("single message", () => {

      let props = {
        messages: ['what?']
      };

      const wrapper = mount(<ErrorMessages {...props} />);
      const lis = wrapper.find('li');

      expect(lis.length).toBe(1);

      const li1 = lis.at(0);
      expect(li1.find('div').find('h1').text()).toEqual('what?');
    });

    it("no messages", () => {

      let props = {
        messages: []
      };

      const wrapper = mount(<ErrorMessages {...props} />);
      const lis = wrapper.find('li');

      expect(lis.length).toBe(0);
    });

});
