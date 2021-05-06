package edu.iu.uits.lms.photoroster.namecoach.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "namecoach")
@Getter
@Setter
public class NameCoachServicesConfig {

    private String url;
    private String token;
}
