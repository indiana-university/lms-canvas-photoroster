package edu.iu.uits.lms.photoroster.namecoach.config;

import edu.iu.uits.lms.canvas.config.CanvasClientTestConfig;
import edu.iu.uits.lms.lti.config.LtiClientTestConfig;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Profile;

@Configuration
//@PropertySource(value={"classpath:env.properties",
//      "${app.fullFilePath}/lms.properties",
//      "${app.fullFilePath}/protected.properties",
//      "${app.fullFilePath}/security.properties"}, ignoreResourceNotFound = false)
@Import({NameCoachEnvironmentConfig.class, CanvasClientTestConfig.class, LtiClientTestConfig.class})
@Profile("namecoach")
public class NameCoachEnvironmentConfigTest {

   @Getter
   @Value("${namecoach.url}")
   private String baseUrl;

   @Getter
   @Value("${namecoach.token}")
   private String token;

   @Bean
   public NameCoachServicesConfig nameCoachServicesConfig() {
      NameCoachServicesConfig config = new NameCoachServicesConfig();
      config.setUrl(baseUrl);
      config.setToken(token);
      return config;
   }

}
