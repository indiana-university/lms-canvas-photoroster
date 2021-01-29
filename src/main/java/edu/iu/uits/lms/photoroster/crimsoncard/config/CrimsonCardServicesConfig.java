package edu.iu.uits.lms.photoroster.crimsoncard.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "crimsoncard")
@Getter
@Setter
public class CrimsonCardServicesConfig {

    private String baseUrl;
    private String authUrl;
    private String clientId;
    private String secret;
    private String lmsHost;
}
