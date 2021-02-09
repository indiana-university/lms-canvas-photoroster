import React from "react";
import Enzyme, {shallow, mount, render} from "enzyme";

import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({adapter: new Adapter()});

import Roles from "../Roles";

describe("Roles", () => {

  global.ungroupedId = "UNGROUPED";

  let group1 = {id: '123', name: 'Group 1'},
      group2 = {id: '456', name: 'Group 2'},
      group3 = {id: '789', name: 'Group 3'};

  let allGroups = [group1, group2, group3];

  it("one role one section two groups", () => {
    const props = {
        enrollmentData: [{badgeble: false, roleGroup: "photoroster.roleGroupings.student",
                          roleGroupSortKey: 1, roleName: "Student", roleSortKey: 0,
                          roleType: "StudentEnrollment", sectionId: "1",
                          sectionName: "SectionA", userId: "user1", groupMemberships: ["123", "789"]}
                       ],
        allGroups: allGroups

      };

    const wrapper = render(<Roles {...props} />);
    const span = wrapper.find('span');
    expect(span.length).toBe(1);
    expect(span.hasClass('rvt-badge--secondary')).toBeTruthy();
    expect(span.prop('title')).toEqual('Sections: SectionA\nGroups: Group 1, Group 3');
    expect(span.text()).toEqual('Student');

  });

  it("one role multiple sections ungrouped", () => {
    const props = {
        enrollmentData: [{badgeble: false, roleGroup: "photoroster.roleGroupings.student",
                          roleGroupSortKey: 1, roleName: "Student", roleSortKey: 0,
                          roleType: "StudentEnrollment", sectionId: "1",
                          sectionName: "SectionA", userId: "user1"},
                          {badgeble: false, roleGroup: "photoroster.roleGroupings.student",
                           roleGroupSortKey: 1, roleName: "Student", roleSortKey: 0,
                           roleType: "StudentEnrollment", sectionId: "2",
                           sectionName: "SectionB", userId: "user1", groupMemberships: [ungroupedId]}
                       ],
        allGroups: allGroups

      };
    const wrapper = render(<Roles {...props} />);
    const span = wrapper.find('span');
    expect(span.length).toBe(1);
    expect(span.hasClass('rvt-badge--secondary')).toBeTruthy();
    expect(span.prop('title')).toEqual('Sections: SectionA, SectionB\nGroups: None');
    expect(span.text()).toEqual('Student');

  });

    it("two roles multiple sections no course groups", () => {
      const props = {
          enrollmentData: [{badgeble: true, roleGroup: "photoroster.roleGroupings.instructor",
                             roleGroupSortKey: 0, roleName: "Teacher", roleSortKey: 0,
                             roleType: "TeacherEnrollment", sectionId: "3",
                             sectionName: "SectionC", userId: "user1"},
                             {badgeble: false, roleGroup: "photoroster.roleGroupings.student",
                                roleGroupSortKey: 1, roleName: "Student", roleSortKey: 0,
                                roleType: "StudentEnrollment", sectionId: "1",
                                sectionName: "SectionA", userId: "user1"},
                                {badgeble: false, roleGroup: "photoroster.roleGroupings.student",
                                 roleGroupSortKey: 1, roleName: "Student", roleSortKey: 0,
                                 roleType: "StudentEnrollment", sectionId: "2",
                                 sectionName: "SectionB", userId: "user1"}
                             ]

        };
      const wrapper = mount(<Roles {...props} />);

      const spans = wrapper.find('span');

      expect(spans.length).toBe(2);

      //Get the first span, which should be instructor role
      const instSpan = spans.at(0);
      expect(instSpan.hasClass('rvt-badge--secondary')).toBeFalsy();
      expect(instSpan.prop('title')).toEqual('Sections: SectionC');
      expect(instSpan.text()).toEqual('Teacher');

      //Get the second span, which should be student role
      const studSpan = spans.at(1);
      expect(studSpan.hasClass('rvt-badge--secondary')).toBeTruthy();
      expect(studSpan.prop('title')).toEqual('Sections: SectionA, SectionB');
      expect(studSpan.text()).toEqual('Student');

    });

});