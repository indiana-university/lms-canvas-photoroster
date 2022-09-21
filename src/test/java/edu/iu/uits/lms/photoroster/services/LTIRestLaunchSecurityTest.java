package edu.iu.uits.lms.photoroster.services;

import edu.iu.uits.lms.canvas.config.CanvasClientTestConfig;
import edu.iu.uits.lms.lti.AbstractLTIRestLaunchSecurityTest;
import edu.iu.uits.lms.lti.config.LtiClientTestConfig;
import edu.iu.uits.lms.photoroster.config.ToolConfig;
import org.springframework.context.annotation.Import;

@Import({ToolConfig.class, CanvasClientTestConfig.class, LtiClientTestConfig.class})
public class LTIRestLaunchSecurityTest extends AbstractLTIRestLaunchSecurityTest {

}
