import React from "react";
import Enzyme, {shallow, mount, render} from "enzyme";

import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({adapter: new Adapter()});

import Image from "../Image";
import { IMAGE_MODES } from '../../../utils/Constants'

describe("Image", () => {

    let imageMap = {};

    beforeEach(() => {
        imageMap[IMAGE_MODES.small] = "SMALL";
        imageMap[IMAGE_MODES.medium] = "MEDIUM";
        imageMap[IMAGE_MODES.canvas] = "CANVAS";
    });


  it("small official image", () => {

    const props = {
            ferpaRendered: true,
            image_mode: IMAGE_MODES.iu,
            image_size: IMAGE_MODES.small,
            imageMap: imageMap
          };
        const wrapper = render(<Image {...props} />);
        const img = wrapper.find('img');
        expect(img.prop('src')).toEqual('SMALL');
        expect(img.hasClass('image-' + IMAGE_MODES.small)).toBeTruthy();
  });

    it("medium official image", () => {

      const props = {
              ferpaRendered: true,
              image_mode: IMAGE_MODES.iu,
              image_size: IMAGE_MODES.medium,
              imageMap: imageMap
            };
          const wrapper = render(<Image {...props} />);
          const img = wrapper.find('img');

          expect(img.prop('src')).toEqual('MEDIUM');
          expect(img.hasClass('image-' + IMAGE_MODES.medium)).toBeTruthy();
    });

    it("canvas avatar image with small specified", () => {

      const props = {
              ferpaRendered: true,
              image_mode: IMAGE_MODES.canvas,
              image_size: IMAGE_MODES.small,
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
              image_size: IMAGE_MODES.medium,
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