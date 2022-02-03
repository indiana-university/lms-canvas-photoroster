import React from "react";
import Enzyme, {shallow, mount, render} from "enzyme";

import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

Enzyme.configure({adapter: new Adapter()});

import Image from "../Image";
import { IMAGE_MODES } from '../../../utils/Constants'

describe("Image", () => {

    let imageMap = {};

    beforeEach(() => {
        imageMap[IMAGE_MODES.iu_small] = "SMALL";
        imageMap[IMAGE_MODES.iu_medium] = "MEDIUM";
        imageMap[IMAGE_MODES.canvas] = "CANVAS";
    });


  it("small official image", () => {

    const props = {
            ferpaRendered: true,
            image_mode: IMAGE_MODES.iu_small,
            imageMap: imageMap
          };
        const wrapper = render(<Image {...props} />);
        const img = wrapper.find('img');
        expect(img.prop('src')).toEqual('SMALL');
        expect(img.hasClass('image-' + IMAGE_MODES.iu_small)).toBeTruthy();
  });

    it("medium official image", () => {

      const props = {
              ferpaRendered: true,
              image_mode: IMAGE_MODES.iu_medium,
              imageMap: imageMap
            };
          const wrapper = render(<Image {...props} />);
          const img = wrapper.find('img');

          expect(img.prop('src')).toEqual('MEDIUM');
          expect(img.hasClass('image-' + IMAGE_MODES.iu_medium)).toBeTruthy();
    });

    it("canvas avatar image with small specified", () => {

      const props = {
              ferpaRendered: true,
              image_mode: IMAGE_MODES.canvas,
              imageMap: imageMap
            };
          const wrapper = render(<Image {...props} />);
          const img = wrapper.find('img');
          expect(img.prop('src')).toEqual('CANVAS');
          expect(img.hasClass('image-' + IMAGE_MODES.canvas)).toBeTruthy();
    });

    it("canvas avatar image with medium specified", () => {

      const props = {
              ferpaRendered: true,
              image_mode: IMAGE_MODES.canvas,
              imageMap: imageMap
            };
          const wrapper = render(<Image {...props} />);
          const img = wrapper.find('img');
          expect(img.prop('src')).toEqual('CANVAS');
          expect(img.hasClass('image-' + IMAGE_MODES.canvas)).toBeTruthy();
    });

    it("canvas avatar image no size", () => {

      const props = {
              ferpaRendered: true,
              image_mode: IMAGE_MODES.canvas,
              imageMap: imageMap
            };
          const wrapper = render(<Image {...props} />);
          const img = wrapper.find('img');
          expect(img.prop('src')).toEqual('CANVAS');
          expect(img.hasClass('image-' + IMAGE_MODES.canvas)).toBeTruthy();
    });

});