package edu.iu.uits.lms.photoroster.services.swagger;

import edu.iu.uits.lms.lti.swagger.AbstractSwaggerUiCustomTest;
import edu.iu.uits.lms.photoroster.WebApplication;
import edu.iu.uits.lms.photoroster.config.SecurityConfig;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest(classes = {WebApplication.class, SecurityConfig.class, SwaggerTestConfig.class})
public class SwaggerUiCustomTest extends AbstractSwaggerUiCustomTest {

   @Override
   protected List<String> getEmbeddedSwaggerToolPaths() {
      return SwaggerTestUtil.getEmbeddedSwaggerToolPaths(super.getEmbeddedSwaggerToolPaths());
   }
}
