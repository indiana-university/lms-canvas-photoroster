package edu.iu.uits.lms.photoroster.services.swagger;

import edu.iu.uits.lms.lti.swagger.AbstractSwaggerEmbeddedToolTest;
import edu.iu.uits.lms.photoroster.WebApplication;
import edu.iu.uits.lms.photoroster.config.SecurityConfig;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static edu.iu.uits.lms.iuonly.IuCustomConstants.IUCUSTOMREST_PROFILE;

@SpringBootTest(classes = {WebApplication.class, SecurityConfig.class, SwaggerTestConfig.class})
@ActiveProfiles({IUCUSTOMREST_PROFILE})
public class SwaggerEmbeddedToolTest extends AbstractSwaggerEmbeddedToolTest {

   @Override
   protected List<String> getEmbeddedSwaggerToolPaths() {
      return SwaggerTestUtil.getEmbeddedSwaggerToolPaths(super.getEmbeddedSwaggerToolPaths());
   }
}
