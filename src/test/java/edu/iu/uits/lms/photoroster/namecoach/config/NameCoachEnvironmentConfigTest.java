package edu.iu.uits.lms.photoroster.namecoach.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource(value={"classpath:env.properties",
      "${app.fullFilePath}/lms.properties",
      "${app.fullFilePath}/protected.properties",
      "${app.fullFilePath}/security.properties"}, ignoreResourceNotFound = false)
@Import(NameCoachEnvironmentConfig.class)
public class NameCoachEnvironmentConfigTest {

//   @Getter
//   @Value("${namecoach.url}")
//   private String baseUrl;
//
//   @Getter
//   @Value("${namecoach.token}")
//   private String token;
//
//   @Bean
//   public NameCoachServicesConfig nameCoachServicesConfig() {
//      NameCoachServicesConfigImpl config = new NameCoachServicesConfigImpl();
//      config.setBaseUrl(baseUrl);
//      config.setToken(token);
//      return config;
//   }

}
