package edu.iu.uits.lms.photoroster.controller;

import edu.iu.uits.lms.canvas.model.groups.CourseGroup;
import edu.iu.uits.lms.canvas.services.GroupService;
import edu.iu.uits.lms.lti.LTIConstants;
import edu.iu.uits.lms.lti.service.OidcTokenUtils;
import edu.iu.uits.lms.photoroster.model.BackingModel;
import edu.iu.uits.lms.photoroster.service.PhotorosterService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import uk.ac.ox.ctl.lti13.security.oauth2.client.lti.authentication.OidcAuthenticationToken;

import javax.servlet.http.HttpServletRequest;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/app/rest")
@Slf4j
public class PhotorosterRestController extends PhotorosterController {

   @Autowired
   private PhotorosterService photorosterService = null;

   @Autowired
   private GroupService groupService = null;

   @RequestMapping(value = "/people/{courseId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
   @Secured({LTIConstants.INSTRUCTOR_AUTHORITY, LTIConstants.TA_AUTHORITY, LTIConstants.STUDENT_AUTHORITY})
   public BackingModel getPeople(@PathVariable("courseId") String courseId, HttpServletRequest request) {
      OidcAuthenticationToken token = getValidatedToken(courseId);
      OidcTokenUtils oidcTokenUtils = new OidcTokenUtils(token);

      String canvasUserId = oidcTokenUtils.getUserId();
      log.debug("/people/" + courseId);
      return photorosterService.buildBackingModel(courseId, canvasUserId, request);
   }

   @RequestMapping(value = "/sections/{courseId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
   @Secured({LTIConstants.INSTRUCTOR_AUTHORITY, LTIConstants.TA_AUTHORITY, LTIConstants.STUDENT_AUTHORITY})
   public Map<String, String> getSections(@PathVariable("courseId") String courseId) {
      log.debug("/sections/" + courseId);
      getValidatedToken(courseId);
      return photorosterService.getSectionMap(courseId);
   }

   /**
    *
    * @param courseId
    * @return a list of {@link CourseGroup}s for the given course. Ordered by group name.
    * Includes an "Ungrouped" group if there are groups in the site
    */
   @RequestMapping(value = "/groups/{courseId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
   @Secured({LTIConstants.INSTRUCTOR_AUTHORITY, LTIConstants.TA_AUTHORITY, LTIConstants.STUDENT_AUTHORITY})
   public List<CourseGroup> getGroups(@PathVariable("courseId") String courseId) {
      log.debug("/groups/" + courseId);
      getValidatedToken(courseId);

      List<CourseGroup> courseGroups = groupService.getGroupsForCourse(courseId);

      // Sort and add an "Ungrouped" group if groups exist in this course
      if (courseGroups != null && !courseGroups.isEmpty()) {
         courseGroups.sort(Comparator.comparing(CourseGroup::getName, String.CASE_INSENSITIVE_ORDER));
         CourseGroup ungrouped = new CourseGroup();
         ungrouped.setId(PhotorosterService.UNGROUPED_ID);
         ungrouped.setName("Ungrouped");
         courseGroups.add(ungrouped);
      }

      return courseGroups;
   }
}
