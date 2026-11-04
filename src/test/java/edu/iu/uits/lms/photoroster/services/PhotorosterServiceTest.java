package edu.iu.uits.lms.photoroster.services;

/*-
 * #%L
 * photoroster
 * %%
 * Copyright (C) 2015 - 2026 Indiana University
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

import edu.iu.uits.lms.canvas.model.User;
import edu.iu.uits.lms.canvas.services.CourseService;
import edu.iu.uits.lms.canvas.services.UserService;
import edu.iu.uits.lms.photoroster.service.PhotorosterService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PhotorosterServiceTest {

   @Mock
   private CourseService courseService;

   @Mock
   private UserService userService;

   @Mock
   private RestTemplate canvasRestTemplateAsUser;

   @InjectMocks
   private PhotorosterService photorosterService;

   private static User user(String id, String loginId) {
      User user = new User();
      user.setId(id);
      user.setLoginId(loginId);
      return user;
   }

   @Test
   void getRosterForCourse_usesTheUsersOwnTokenWithoutMasquerading() {
      // @InjectMocks matches by type first; make sure the per-user template is the one wired in
      ReflectionTestUtils.setField(photorosterService, "canvasRestTemplateAsUser", canvasRestTemplateAsUser);
      when(courseService.getRosterForCourseAsUser(eq("1234"), isNull(), anyList(), eq(canvasRestTemplateAsUser)))
            .thenReturn(List.of(user("1", "teacher1"), user("2", "student2")));

      List<User> roster = photorosterService.getRosterForCourse("1234", "456");

      assertThat(roster).extracting(User::getLoginId).containsExactly("teacher1", "student2");
      verify(courseService).getRosterForCourseAsUser(eq("1234"), isNull(), anyList(), eq(canvasRestTemplateAsUser));
      // login ids were all present, so no admin-token backfill
      verify(courseService, never()).getUsersForCourseByType(anyString(), anyList(), anyList());
   }

   @Test
   void getRosterForCourse_backfillsMissingLoginIdsWithTheAdminToken() {
      ReflectionTestUtils.setField(photorosterService, "canvasRestTemplateAsUser", canvasRestTemplateAsUser);
      // what a student's own token returns: no login ids (Student has view_user_logins disabled)
      when(courseService.getRosterForCourseAsUser(eq("1234"), isNull(), anyList(), eq(canvasRestTemplateAsUser)))
            .thenReturn(List.of(user("1", null), user("2", null)));
      // the admin-token, unscoped course user list (the 3-arg overload uses the admin RestTemplate)
      when(courseService.getUsersForCourseByType(eq("1234"), anyList(), anyList()))
            .thenReturn(List.of(user("1", "teacher1")));
      User fromUserLookup = user("2", "student2");
      when(userService.getUserByCanvasId("2")).thenReturn(fromUserLookup);

      List<User> roster = photorosterService.getRosterForCourse("1234", "456");

      assertThat(roster).extracting(User::getLoginId).containsExactly("teacher1", "student2");
   }

   @Test
   void getRosterForCourse_dropsUsersWhoseLoginIdCantBeFound() {
      ReflectionTestUtils.setField(photorosterService, "canvasRestTemplateAsUser", canvasRestTemplateAsUser);
      when(courseService.getRosterForCourseAsUser(eq("1234"), isNull(), anyList(), any(RestTemplate.class)))
            .thenReturn(new java.util.ArrayList<>(List.of(user("1", "teacher1"), user("2", null))));
      when(courseService.getUsersForCourseByType(eq("1234"), anyList(), anyList())).thenReturn(List.of());
      when(userService.getUserByCanvasId("2")).thenReturn(null);

      List<User> roster = photorosterService.getRosterForCourse("1234", "456");

      // can't run the FERPA check without a login id, so the user is left out
      assertThat(roster).extracting(User::getId).containsExactly("1");
   }
}
