//package edu.iu.uits.lms.photoroster.crimsoncard.service;
//
//import com.fasterxml.jackson.core.type.TypeReference;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import edu.iu.uits.lms.photoroster.crimsoncard.config.CrimsonCardServicesConfig;
//import org.junit.Assert;
//import org.junit.Test;
//import org.junit.runner.RunWith;
//import org.mockito.Mockito;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Qualifier;
//import org.springframework.boot.test.context.TestConfiguration;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.context.annotation.Bean;
//import org.springframework.core.ParameterizedTypeReference;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
//import org.springframework.security.oauth2.client.OAuth2RestTemplate;
//import org.springframework.test.context.junit4.SpringRunner;
//
//import java.util.ArrayList;
//import java.util.Collections;
//import java.util.List;
//import java.util.Map;
//
//import static edu.iu.uits.lms.photoroster.crimsoncard.service.CrimsonCardPhotoService.CCImageResponse;
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.ArgumentMatchers.anyString;
//
////@RunWith(SpringRunner.class)
//public class CrimsonCardPhotoServiceTest {
//
//   @Autowired
//   private CrimsonCardPhotoService crimsonCardPhotoService = null;
//
//   @Qualifier("ccRestTemplate")
//   @MockBean
//   private OAuth2RestTemplate ccRestTemplate;
//
//   @MockBean
//   private CrimsonCardServicesConfig config;
//
//   @Test
//   public void testImages() {
//      //Mock the actual call's details
//      List<String> ids = Collections.singletonList("mcortesb");
//
//      List<CCImageResponse> results = new ArrayList<>();
//      results.add(new CCImageResponse("asdf", "foobar"));
//      results.add(new CCImageResponse("asdf", "doodah"));
//      results.add(new CCImageResponse("qwerty", "zxcv"));
//      results.add(new CCImageResponse("qwerty", "zxcv"));
//
//      ResponseEntity<List<CCImageResponse>> r =
//            new ResponseEntity<>(results, HttpStatus.OK);
//
//      Mockito.when(ccRestTemplate.exchange(anyString(), any(), any(), any(ParameterizedTypeReference.class)))
//            .thenReturn(r);
//
//
//      Map<String, String> imageUrls = crimsonCardPhotoService.getImageUrls(ids, CrimsonCardPhotoService.CCAttributes.ID_TYPE.NETWORK_ID, CrimsonCardPhotoService.CCAttributes.SIZE.S75X100);
//
//      Assert.assertEquals("Should have two results", 2, imageUrls.keySet().size());
//   }
//
//   @Test
//   public void testStuff() {
//      List<CCImageResponse> results = new ArrayList<>();
//      results.add(new CCImageResponse("asdf", "foobar"));
//      results.add(new CCImageResponse("asdf", "foobar"));
//
//      Assert.assertEquals("Objects should be equal when the urls is the same", 1, results.stream().distinct().count());
//
//      results = new ArrayList<>();
//      results.add(new CCImageResponse("asdf", "foobar"));
//      results.add(new CCImageResponse("asdf", "doodah"));
//
//      Assert.assertEquals("Objects should be equal even when the url is different", 1, results.stream().distinct().count());
//
//      results = new ArrayList<>();
//      results.add(new CCImageResponse("asdf", "foobar"));
//      results.add(new CCImageResponse("cwm", "doodah"));
//
//      Assert.assertEquals("Should still have 2 distinct things in here", 2, results.stream().distinct().count());
//   }
//
//   @Test
//   public void testWithObject() throws Exception {
//      ObjectMapper objectMapper = Jackson2ObjectMapperBuilder.json().build();
//      CCImageResponse inputObj = new CCImageResponse("user1", "http://foobar.com");
//
//      String json = objectMapper.writeValueAsString(Collections.singletonList(inputObj));
//
//      TypeReference<ArrayList<CCImageResponse>> listType = new TypeReference<>() {};
//
//      List<CCImageResponse> stuff = objectMapper.readValue(json, listType);
//
//      Assert.assertNotNull(stuff);
//      Assert.assertNotNull(stuff.get(0).getId());
//   }
//
//   @Test
//   public void testWithJson() throws Exception {
//      ObjectMapper objectMapper = Jackson2ObjectMapperBuilder.json().build();
//
//      String json = "[{\"Id\":\"user1\",\"PhotoUrl\":\"http://foobar.com\"}]";
//      TypeReference<ArrayList<CCImageResponse>> listType = new TypeReference<>() {};
//
//
//      List<CCImageResponse> stuff = objectMapper.readValue(json, listType);
//
//      Assert.assertNotNull(stuff);
//      Assert.assertNotNull(stuff.get(0).getId());
//   }
//
//   @TestConfiguration
//   static class TestConfig {
//      @Bean
//      public CrimsonCardPhotoService crimsonCardPhotoService() {
//         return new CrimsonCardPhotoService();
//      }
//
//   }
//}
