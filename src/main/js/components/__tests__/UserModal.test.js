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
        imageMap[IMAGE_MODES.small] = "SMALL";
        imageMap[IMAGE_MODES.medium] = "MEDIUM";
        imageMap[IMAGE_MODES.canvas] = "CANVAS";

        props = {
            modalUser: {
                user: {name: "foo"},
                imageMap: imageMap
            }
        };
    });

    it("medium official image", () => {

      props.image_mode = IMAGE_MODES.iu;
      props.image_size = IMAGE_MODES.medium
      const wrapper = render(<UserModal {...props} />);
      const img = wrapper.find('img');

      expect(img.prop('src')).toEqual('MEDIUM');
      expect(img.hasClass('image-' + IMAGE_MODES.medium)).toBeTruthy();
    });

    it("canvas avatar with small", () => {

      props.image_mode = IMAGE_MODES.canvas;
      props.image_size = IMAGE_MODES.small
      const wrapper = render(<UserModal {...props} />);
      const img = wrapper.find('img');

      expect(img.prop('src')).toEqual('CANVAS');
      expect(img.hasClass('image-' + IMAGE_MODES.canvas)).toBeTruthy();
    });

    it("canvas avatar with medium", () => {

      props.image_mode = IMAGE_MODES.canvas;
      props.image_size = IMAGE_MODES.medium
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