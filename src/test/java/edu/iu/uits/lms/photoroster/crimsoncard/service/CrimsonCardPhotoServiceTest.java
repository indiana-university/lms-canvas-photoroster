package edu.iu.uits.lms.photoroster.crimsoncard.service;

/*-
 * #%L
 * photoroster
 * %%
 * Copyright (C) 2015 - 2022 Indiana University
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

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.iu.uits.lms.photoroster.crimsoncard.config.CrimsonCardServicesConfig;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static edu.iu.uits.lms.photoroster.crimsoncard.service.CrimsonCardPhotoService.CCImageResponse;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;

@ContextConfiguration(classes={CrimsonCardPhotoService.class})
@SpringBootTest
@Slf4j
public class CrimsonCardPhotoServiceTest {

   @Autowired
   private CrimsonCardPhotoService crimsonCardPhotoService = null;

   @Qualifier("ccWebClient")
   @MockBean
   private WebClient ccWebClient;

   @MockBean
   private CrimsonCardServicesConfig config;

   @Mock
   WebClient.RequestBodyUriSpec requestBodyUriSpec;

   @Mock
   WebClient.RequestHeadersSpec requestHeadersSpec;

   @Mock
   WebClient.RequestBodySpec requestBodySpec;

   @Mock
   WebClient.ResponseSpec responseSpec;

   @Test
   public void testImages() {
      //Mock the actual call's details
      List<String> ids = Collections.singletonList("mcortesb");

      List<CCImageResponse> results = new ArrayList<>();
      results.add(new CCImageResponse("asdf", "foobar"));
      results.add(new CCImageResponse("asdf", "doodah"));
      results.add(new CCImageResponse("qwerty", "zxcv"));
      results.add(new CCImageResponse("qwerty", "zxcv"));

      ResponseEntity<List<CCImageResponse>> r =
            new ResponseEntity<>(results, HttpStatus.OK);

      // fancy code to mock WebClient and return an entity
      Mockito.when(ccWebClient.post()).thenReturn(requestBodyUriSpec);
      Mockito.when(requestBodyUriSpec.uri(anyString())).thenReturn(requestBodySpec);
      Mockito.when(requestBodySpec.header(any(),any())).thenReturn(requestBodySpec);
      Mockito.when(requestHeadersSpec.header(any(),any())).thenReturn(requestHeadersSpec);
      Mockito.when(requestBodySpec.accept(any())).thenReturn(requestBodySpec);
      Mockito.when(requestBodySpec.body(any(), eq(List.class))).thenReturn(requestHeadersSpec);
      Mockito.when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
      Mockito.when(responseSpec.toEntity(any(ParameterizedTypeReference.class))).thenReturn(Mono.just(r));

      Map<String, String> imageUrls = crimsonCardPhotoService.getImageUrls(ids, CrimsonCardPhotoService.CCAttributes.ID_TYPE.NETWORK_ID, CrimsonCardPhotoService.CCAttributes.SIZE.S75X100);

      Assertions.assertEquals(2, imageUrls.keySet().size(), "Should have two results");
   }

   @Test
   public void testStuff() {
      List<CCImageResponse> results = new ArrayList<>();
      results.add(new CCImageResponse("asdf", "foobar"));
      results.add(new CCImageResponse("asdf", "foobar"));

      Assertions.assertEquals(1, results.stream().distinct().count(), "Objects should be equal when the urls is the same");

      results = new ArrayList<>();
      results.add(new CCImageResponse("asdf", "foobar"));
      results.add(new CCImageResponse("asdf", "doodah"));

      Assertions.assertEquals(1, results.stream().distinct().count(), "Objects should be equal even when the url is different");

      results = new ArrayList<>();
      results.add(new CCImageResponse("asdf", "foobar"));
      results.add(new CCImageResponse("cwm", "doodah"));

      Assertions.assertEquals(2, results.stream().distinct().count(), "Should still have 2 distinct things in here");
   }

   @Test
   public void testWithObject() throws Exception {
      ObjectMapper objectMapper = Jackson2ObjectMapperBuilder.json().build();
      CCImageResponse inputObj = new CCImageResponse("user1", "http://foobar.com");

      String json = objectMapper.writeValueAsString(Collections.singletonList(inputObj));

      TypeReference<ArrayList<CCImageResponse>> listType = new TypeReference<>() {};

      List<CCImageResponse> stuff = objectMapper.readValue(json, listType);

      Assertions.assertNotNull(stuff);
      Assertions.assertNotNull(stuff.get(0).getId());
   }

   @Test
   public void testWithJson() throws Exception {
      ObjectMapper objectMapper = Jackson2ObjectMapperBuilder.json().build();

      String json = "[{\"Id\":\"user1\",\"PhotoUrl\":\"http://foobar.com\"}]";
      TypeReference<ArrayList<CCImageResponse>> listType = new TypeReference<>() {};


      List<CCImageResponse> stuff = objectMapper.readValue(json, listType);

      Assertions.assertNotNull(stuff);
      Assertions.assertNotNull(stuff.get(0).getId());
   }

   @TestConfiguration
   static class TestConfig {
      @Bean
      public CrimsonCardPhotoService crimsonCardPhotoService() {
         return new CrimsonCardPhotoService();
      }

   }
}
