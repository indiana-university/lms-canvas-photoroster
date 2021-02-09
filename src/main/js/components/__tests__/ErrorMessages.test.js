import React from "react";
import Enzyme, {shallow, mount, render} from "enzyme";

import Adapter from 'enzyme-adapter-react-16';

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