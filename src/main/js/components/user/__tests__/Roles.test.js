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
    const span = wrapper.find('span.roleContainer');
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
    const span = wrapper.find('span.roleContainer');
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

      const spans = wrapper.find('span.roleContainer');

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
