package edu.iu.uits.lms.photoroster.namecoach.config;

import edu.iu.uits.lms.photoroster.namecoach.NameCoachTokenAuthorizationInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.BufferingClientHttpRequestFactory;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Configuration
public class NameCoachEnvironmentConfig {

    @Autowired
    private NameCoachServicesConfig config;

    @Bean(name = "ncRestTemplate")
    public RestTemplate ncRestTemplate() {
        RestTemplate restTemplate = new RestTemplate(new BufferingClientHttpRequestFactory(new SimpleClientHttpRequestFactory()));

        restTemplate.getInterceptors().add(new NameCoachTokenAuthorizationInterceptor(config.getToken()));
//        restTemplate.getInterceptors().add(new LoggingRequestInterceptor());
//        restTemplate.setErrorHandler(new CanvasErrorHandler());
        return restTemplate;
    }
}
