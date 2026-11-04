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

import edu.iu.uits.lms.canvas.services.GroupService;
import edu.iu.uits.lms.canvasoauth2.security.CanvasOAuth2AuthorizedClientRepository;
import edu.iu.uits.lms.common.server.ServerInfo;
import edu.iu.uits.lms.lti.LTIConstants;
import edu.iu.uits.lms.lti.config.TestUtils;
import edu.iu.uits.lms.lti.repository.DefaultInstructorRoleRepository;
import edu.iu.uits.lms.photoroster.config.SecurityConfig;
import edu.iu.uits.lms.photoroster.controller.PhotorosterRestController;
import edu.iu.uits.lms.photoroster.model.BackingModel;
import edu.iu.uits.lms.photoroster.service.PhotorosterService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.HttpHeaders;
import org.springframework.security.oauth2.client.ClientAuthorizationRequiredException;
import org.springframework.security.oauth2.client.endpoint.OAuth2AccessTokenResponseClient;
import org.springframework.security.oauth2.client.endpoint.OAuth2AuthorizationCodeGrantRequest;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import uk.ac.ox.ctl.lti13.security.oauth2.client.lti.authentication.OidcAuthenticationToken;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static edu.iu.uits.lms.photoroster.services.CanvasOAuth2TestSupport.REGISTRATION_ID;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(value = PhotorosterRestController.class, properties = {"oauth.tokenprovider.url=http://foo"})
@ContextConfiguration(classes = {PhotorosterRestController.class, SecurityConfig.class,
      edu.iu.uits.lms.canvasoauth2.controller.OAuth2ConsentControllerAdvice.class,
      edu.iu.uits.lms.canvasoauth2.controller.CanvasOAuth2ConsentText.class,
      CanvasOAuth2TestSupport.TestConfig.class})
public class PhotorosterRestControllerTest {

   private static final String CANVAS_USER_ID = "456";

   @Autowired
   private MockMvc mvc;

   @MockitoBean
   private PhotorosterService photorosterService;

   @MockitoBean
   private GroupService groupService;

   @MockitoBean
   private DefaultInstructorRoleRepository defaultInstructorRoleRepository;

   @MockitoBean(name = ServerInfo.BEAN_NAME)
   private ServerInfo serverInfo;

   @MockitoBean
   private ClientRegistrationRepository clientRegistrationRepository;

   // SecurityConfig injects this from CanvasOAuth2ClientConfig, which this slice doesn't load
   @MockitoBean
   private OAuth2AccessTokenResponseClient<OAuth2AuthorizationCodeGrantRequest> canvasOAuth2AccessTokenResponseClient;

   @Autowired
   private CanvasOAuth2AuthorizedClientRepository canvasOAuth2AuthorizedClientRepository;

   private static OidcAuthenticationToken studentToken() {
      Map<String, Object> customMap = new HashMap<>();
      customMap.put(LTIConstants.CUSTOM_CANVAS_COURSE_ID_KEY, "1234");
      customMap.put(LTIConstants.CUSTOM_CANVAS_USER_ID_KEY, CANVAS_USER_ID);
      return TestUtils.buildToken("userId", LTIConstants.STUDENT_AUTHORITY, new HashMap<>(), customMap);
   }

   @Test
   public void peopleReturnsTheBackingModel() throws Exception {
      BackingModel backingModel = new BackingModel(List.of(), List.of(), null, "Course", null, List.of());
      when(photorosterService.buildBackingModel(eq("1234"), eq(CANVAS_USER_ID), any())).thenReturn(backingModel);

      mvc.perform(get("/app/rest/people/1234")
                  .with(authentication(studentToken()))
                  .header(HttpHeaders.USER_AGENT, TestUtils.defaultUseragent()))
            .andExpect(status().isOk());

      verify(photorosterService).buildBackingModel(eq("1234"), eq(CANVAS_USER_ID), any());
   }

   @Test
   public void peopleReturns401WhenCanvasAccessIsMissingOrRevoked() throws Exception {
      // CanvasOAuth2TokenInterceptor throws this when the user's token can't be loaded or refreshed
      when(photorosterService.buildBackingModel(eq("1234"), eq(CANVAS_USER_ID), any()))
            .thenThrow(new ClientAuthorizationRequiredException(REGISTRATION_ID));

      // A 401 rather than the consent page, which can't render in a REST response; the React app reloads on 401
      mvc.perform(get("/app/rest/people/1234")
                  .with(authentication(studentToken()))
                  .header(HttpHeaders.USER_AGENT, TestUtils.defaultUseragent()))
            .andExpect(status().isUnauthorized());
   }

   @Test
   public void peopleRequiresAuthn() throws Exception {
      mvc.perform(get("/app/rest/people/1234")
                  .header(HttpHeaders.USER_AGENT, TestUtils.defaultUseragent()))
            .andExpect(status().isForbidden());
   }
}
