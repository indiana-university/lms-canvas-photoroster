package edu.iu.uits.lms.photoroster.controller;

import edu.iu.uits.lms.lti.LTIConstants;
import edu.iu.uits.lms.lti.controller.OidcTokenAwareController;
import edu.iu.uits.lms.lti.service.OidcTokenUtils;
import edu.iu.uits.lms.photoroster.service.PhotorosterService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestWrapper;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import uk.ac.ox.ctl.lti13.security.oauth2.client.lti.authentication.OidcAuthenticationToken;

import javax.servlet.http.HttpSession;

@Slf4j
@RequestMapping("/app")
@Controller
public class PhotorosterController extends OidcTokenAwareController {

   @RequestMapping(value = "/accessDenied")
   public String accessDenied() {
      return "accessDenied";
   }

   @GetMapping("/launch")
   public String launch(Model model, SecurityContextHolderAwareRequestWrapper request) {
      OidcAuthenticationToken token = getTokenWithoutContext();
      OidcTokenUtils oidcTokenUtils = new OidcTokenUtils(token);
      String courseId = oidcTokenUtils.getCourseId();

      return index(courseId, model, request.getSession());
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
