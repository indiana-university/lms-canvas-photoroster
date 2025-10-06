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
import React from "react";
import Enzyme, {shallow, mount, render} from "enzyme";

import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

Enzyme.configure({adapter: new Adapter()});

import UserModal from "../UserModal";
import { IMAGE_MODES } from '../../utils/Constants'

describe("UserModal", () => {
    let props = {};

    beforeEach(() => {
        let imageMap = {};
        imageMap[IMAGE_MODES.iu_small] = "SMALL";
        imageMap[IMAGE_MODES.iu_medium] = "MEDIUM";
        imageMap[IMAGE_MODES.canvas] = "CANVAS";

        props = {
            modalUser: {
                user: {name: "foo"},
                imageMap: imageMap
            }
        };
    });

    it("medium official image", () => {

      props.image_mode = IMAGE_MODES.iu_medium;
      const wrapper = render(<UserModal {...props} />);
      const img = wrapper.find('img');

      expect(img.prop('src')).toEqual('MEDIUM');
      expect(img.hasClass('image-' + IMAGE_MODES.iu_medium)).toBeTruthy();
    });

    it("canvas avatar with small", () => {

      props.image_mode = IMAGE_MODES.canvas;
      const wrapper = render(<UserModal {...props} />);
      const img = wrapper.find('img');

      expect(img.prop('src')).toEqual('CANVAS');
      expect(img.hasClass('image-' + IMAGE_MODES.canvas)).toBeTruthy();
    });

    it("canvas avatar with medium", () => {

      props.image_mode = IMAGE_MODES.canvas;
      const wrapper = render(<UserModal {...props} />);
      const img = wrapper.find('img');

      expect(img.prop('src')).toEqual('CANVAS');
      expect(img.hasClass('image-' + IMAGE_MODES.canvas)).toBeTruthy();
    });

    it("canvas avatar with none", () => {

      props.image_mode = IMAGE_MODES.canvas;
      const wrapper = render(<UserModal {...props} />);
      const img = wrapper.find('img');

      expect(img.prop('src')).toEqual('CANVAS');
      expect(img.hasClass('image-' + IMAGE_MODES.canvas)).toBeTruthy();
    });

});
