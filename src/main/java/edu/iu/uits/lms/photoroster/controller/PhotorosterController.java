package edu.iu.uits.lms.photoroster.controller;

import edu.iu.uits.lms.lti.LTIConstants;
import edu.iu.uits.lms.lti.controller.LtiAuthenticationTokenAwareController;
import edu.iu.uits.lms.photoroster.service.PhotorosterService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpSession;

@Slf4j
@RequestMapping("/app")
@Controller
public class PhotorosterController extends LtiAuthenticationTokenAwareController {

   @RequestMapping(value = "/accessDenied")
   public String accessDenied() {
      return "accessDenied";
   }

   @RequestMapping(value = "/{courseId}")
   @Secured({LTIConstants.INSTRUCTOR_AUTHORITY, LTIConstants.TA_AUTHORITY, LTIConstants.STUDENT_AUTHORITY})
   public String index(@PathVariable("courseId") String courseId, Model model, HttpSession httpSession) {
      getValidatedToken(courseId);
      model.addAttribute("courseId", courseId);
      model.addAttribute("ungroupedId", PhotorosterService.UNGROUPED_ID);
      //For session tracking
      model.addAttribute("customId", httpSession.getId());
      return "react";
   }

}
