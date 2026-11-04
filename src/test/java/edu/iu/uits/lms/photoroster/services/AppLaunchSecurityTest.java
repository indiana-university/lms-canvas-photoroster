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

import edu.iu.uits.lms.canvasoauth2.security.CanvasOAuth2AuthorizedClientRepository;
import edu.iu.uits.lms.common.server.ServerInfo;
import edu.iu.uits.lms.lti.LTIConstants;
import edu.iu.uits.lms.lti.config.TestUtils;
import edu.iu.uits.lms.lti.controller.InvalidTokenContextException;
import edu.iu.uits.lms.lti.repository.DefaultInstructorRoleRepository;
import edu.iu.uits.lms.photoroster.config.SecurityConfig;
import edu.iu.uits.lms.photoroster.controller.PhotorosterController;
import edu.iu.uits.lms.photoroster.service.PhotorosterService;
import jakarta.servlet.ServletException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.client.endpoint.OAuth2AccessTokenResponseClient;
import org.springframework.security.oauth2.client.endpoint.OAuth2AuthorizationCodeGrantRequest;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import uk.ac.ox.ctl.lti13.security.oauth2.client.lti.authentication.OidcAuthenticationToken;

import static edu.iu.uits.lms.photoroster.services.CanvasOAuth2TestSupport.REGISTRATION_ID;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.model;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;

@WebMvcTest(value = PhotorosterController.class, properties = {"oauth.tokenprovider.url=http://foo"})
@ContextConfiguration(classes = {PhotorosterController.class, SecurityConfig.class,
      edu.iu.uits.lms.canvasoauth2.controller.OAuth2ConsentControllerAdvice.class,
      edu.iu.uits.lms.canvasoauth2.controller.CanvasOAuth2ConsentText.class,
      CanvasOAuth2TestSupport.TestConfig.class})
public class AppLaunchSecurityTest {

   @Autowired
   private MockMvc mvc;

   @MockitoBean
   private PhotorosterService photorosterService;

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

   @BeforeEach
   void resetCanvasOAuth2AuthorizedClientRepositoryMock() {
      // TestConfig's @Bean isn't a @MockitoBean, so it isn't reset between tests automatically
      reset(canvasOAuth2AuthorizedClientRepository);
      when(canvasOAuth2AuthorizedClientRepository.hasResolvableCanvasUserId(any())).thenReturn(true);
   }

   private void stubConsented() {
      when(canvasOAuth2AuthorizedClientRepository.loadAuthorizedClient(eq(REGISTRATION_ID), any(), any()))
            .thenReturn(CanvasOAuth2TestSupport.authorizedClient());
   }

   @Test
   public void appNoAuthnLaunch() throws Exception {
      //This is a secured endpoint and should not allow access without authn
      mvc.perform(get("/app/1234")
            .header(HttpHeaders.USER_AGENT, TestUtils.defaultUseragent())
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isForbidden());
   }

   @Test
   public void appAuthnWrongContextLaunch() throws Exception {
      OidcAuthenticationToken token = TestUtils.buildToken("userId", "asdf", LTIConstants.BASE_USER_AUTHORITY);

      ServletException t = Assertions.assertThrows(ServletException.class, () ->
              mvc.perform(get("/app/1234")
                      .with(authentication(token))
                      .header(HttpHeaders.USER_AGENT, TestUtils.defaultUseragent())
                      .contentType(MediaType.APPLICATION_JSON))
      );

      Assertions.assertInstanceOf(InvalidTokenContextException.class, t.getCause());
      Assertions.assertEquals("Context in authentication token does not match request context", t.getCause().getMessage());
   }

   @Test
   public void appAuthnLaunch() throws Exception {
      stubConsented();
      OidcAuthenticationToken token = TestUtils.buildToken("userId",
              "1234", LTIConstants.INSTRUCTOR_AUTHORITY);

      //This is a secured endpoint and should not allow access without authn
      mvc.perform(get("/app/1234")
            .with(authentication(token))
            .header(HttpHeaders.USER_AGENT, TestUtils.defaultUseragent())
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());
   }

   @Test
   public void appAuthnLaunchRequiresCanvasOAuth2ConsentWhenNoAuthorizedClient() throws Exception {
      when(canvasOAuth2AuthorizedClientRepository.loadAuthorizedClient(eq(REGISTRATION_ID), any(), any())).thenReturn(null);
      OidcAuthenticationToken token = TestUtils.buildToken("userId", "1234", LTIConstants.INSTRUCTOR_AUTHORITY);

      mvc.perform(get("/app/1234")
                  .with(authentication(token))
                  .header(HttpHeaders.USER_AGENT, TestUtils.defaultUseragent()))
            .andExpect(status().isOk())
            .andExpect(view().name("connectCanvas"))
            .andExpect(model().attribute("authorizationUri", "/oauth2/authorization/" + REGISTRATION_ID));

      verifyNoInteractions(photorosterService);
   }

   @Test
   public void studentLaunchAlsoRequiresCanvasOAuth2Consent() throws Exception {
      // Every role's page loads the roster with the user's own Canvas token, students included
      when(canvasOAuth2AuthorizedClientRepository.loadAuthorizedClient(eq(REGISTRATION_ID), any(), any())).thenReturn(null);
      OidcAuthenticationToken token = TestUtils.buildToken("userId", "1234", LTIConstants.STUDENT_AUTHORITY);

      mvc.perform(get("/app/1234")
                  .with(authentication(token))
                  .header(HttpHeaders.USER_AGENT, TestUtils.defaultUseragent()))
            .andExpect(status().isOk())
            .andExpect(view().name("connectCanvas"));
   }

   @Test
   public void studentLaunchWithConsent() throws Exception {
      stubConsented();
      OidcAuthenticationToken token = TestUtils.buildToken("userId", "1234", LTIConstants.STUDENT_AUTHORITY);

      mvc.perform(get("/app/1234")
                  .with(authentication(token))
                  .header(HttpHeaders.USER_AGENT, TestUtils.defaultUseragent()))
            .andExpect(status().isOk())
            .andExpect(view().name("react"));
   }

   @Test
   public void randomUrlNoAuth() throws Exception {
      //This is a secured endpoint and should not allow access without authn
      mvc.perform(get("/asdf/foobar")
            .header(HttpHeaders.USER_AGENT, TestUtils.defaultUseragent())
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isForbidden());
   }

   @Test
   public void randomUrlWithAuth() throws Exception {
      OidcAuthenticationToken token = TestUtils.buildToken("userId",
              "asdf", LTIConstants.BASE_USER_AUTHORITY);

      //This is a secured endpoint and should not allow access without authn
      mvc.perform(get("/asdf/foobar")
            .with(authentication(token))
            .header(HttpHeaders.USER_AGENT, TestUtils.defaultUseragent())
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isNotFound());
   }
}
