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

import edu.iu.uits.lms.canvas.security.CanvasOAuth2TokenInterceptor;
import edu.iu.uits.lms.canvasoauth2.CanvasOAuth2Registration;
import edu.iu.uits.lms.canvasoauth2.config.CanvasRestTemplateAsUserConfig;
import edu.iu.uits.lms.photoroster.crimsoncard.config.CrimsonCardPhotoServicesEnvironmentConfig;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;

/**
 * Photoroster has two OAuth2 clients, each with its own {@code OAuth2AuthorizedClientManager}: crimsoncard's
 * (client credentials, bean name {@code authorizedClientManager}) and canvas-oauth2-client's
 * ({@code canvasOAuth2AuthorizedClientManager}). Loads both real configurations together to make sure each one
 * gets its own manager. The controller slices don't load either, so nothing else covers this.
 */
class OAuth2ClientManagerWiringTest {

   private final ApplicationContextRunner contextRunner = new ApplicationContextRunner()
         .withUserConfiguration(CrimsonCardPhotoServicesEnvironmentConfig.class, CanvasRestTemplateAsUserConfig.class)
         .withPropertyValues("canvas.oauth2.enabled=true")
         .withBean(ClientRegistrationRepository.class, () -> mock(ClientRegistrationRepository.class))
         .withBean(OAuth2AuthorizedClientService.class, () -> mock(OAuth2AuthorizedClientService.class))
         .withBean("CanvasRestTemplate", RestTemplate.class, RestTemplate::new)
         .withBean(CanvasOAuth2Registration.class, () -> new CanvasOAuth2Registration("photoroster", "/app/jsrivet"));

   @Test
   void canvasPerUserRestTemplateUsesTheCanvasClientManager() {
      OAuth2AuthorizedClientManager canvasManager = mock(OAuth2AuthorizedClientManager.class);
      contextRunner
            .withBean("canvasOAuth2AuthorizedClientManager", OAuth2AuthorizedClientManager.class, () -> canvasManager)
            .run(context -> {
               assertThat(context).hasNotFailed();
               RestTemplate restTemplate = context.getBean("CanvasRestTemplateAsUser", RestTemplate.class);
               CanvasOAuth2TokenInterceptor interceptor = restTemplate.getInterceptors().stream()
                     .filter(CanvasOAuth2TokenInterceptor.class::isInstance)
                     .map(CanvasOAuth2TokenInterceptor.class::cast)
                     .findFirst().orElseThrow();
               // not crimsoncard's "authorizedClientManager", which can't produce Canvas user tokens
               assertThat(ReflectionTestUtils.getField(interceptor, "authorizedClientManager")).isSameAs(canvasManager);
               assertThat(context.getBean("authorizedClientManager")).isNotSameAs(canvasManager);
               assertThat(context.getBean("ccWebClient", WebClient.class)).isNotNull();
            });
   }
}
