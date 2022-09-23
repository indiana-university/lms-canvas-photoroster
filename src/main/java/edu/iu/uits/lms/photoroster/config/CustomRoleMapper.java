package edu.iu.uits.lms.photoroster.config;

import edu.iu.uits.lms.canvas.helpers.EnrollmentHelper;
import edu.iu.uits.lms.lti.LTIConstants;
import edu.iu.uits.lms.lti.repository.DefaultInstructorRoleRepository;
import edu.iu.uits.lms.lti.service.LmsDefaultGrantedAuthoritiesMapper;
import lombok.extern.slf4j.Slf4j;

import java.util.Arrays;
import java.util.List;

@Slf4j
public class CustomRoleMapper extends LmsDefaultGrantedAuthoritiesMapper {

   public CustomRoleMapper(DefaultInstructorRoleRepository defaultInstructorRoleRepository) {
      super(defaultInstructorRoleRepository);
   }

   @Override
   protected String returnEquivalentAuthority(String[] userRoles, List<String> instructorRoles) {
      List<String> userRoleList = Arrays.asList(userRoles);

      for (String instructorRole : instructorRoles) {
         if (userRoleList.contains(instructorRole)) {
            return LTIConstants.INSTRUCTOR_AUTHORITY;
         }
      }

      // let TAs use the tool. Compared to students, they should see the sign-in view
      if (userRoleList.contains(EnrollmentHelper.TYPE_TA)) {
         return LTIConstants.TA_AUTHORITY;
      }

      // The code will ultimately not let observers see anything if they figure out how to access the tool
      if (userRoleList.contains(EnrollmentHelper.TYPE_OBSERVER)) {
         return LTIConstants.OBSERVER_AUTHORITY;
      }

      return LTIConstants.STUDENT_AUTHORITY;
   }
}
