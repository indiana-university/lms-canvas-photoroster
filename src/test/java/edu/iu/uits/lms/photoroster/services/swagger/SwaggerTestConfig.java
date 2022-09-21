package edu.iu.uits.lms.photoroster.services.swagger;

import edu.iu.uits.lms.photoroster.namecoach.service.NameCoachService;
import edu.iu.uits.lms.photoroster.service.PhotorosterService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.web.client.RestTemplate;

@TestConfiguration
public class SwaggerTestConfig {
    @MockBean
    private PhotorosterService photorosterService;

    @MockBean
    private NameCoachService nameCoachService;

    @Qualifier("ncRestTemplate")
    @MockBean
    public RestTemplate ncRestTemplate;
}
