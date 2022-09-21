package edu.iu.uits.lms.photoroster.services;

import edu.iu.uits.lms.iuonly.AbstractIuCustomRestDisabledLaunchSecurityTest;
import edu.iu.uits.lms.photoroster.config.ToolConfig;
import edu.iu.uits.lms.photoroster.services.swagger.SwaggerTestConfig;
import org.springframework.context.annotation.Import;

@Import({ToolConfig.class, SwaggerTestConfig.class})
public class IuCustomRestDisabledLaunchSecurityTest extends AbstractIuCustomRestDisabledLaunchSecurityTest {

}
