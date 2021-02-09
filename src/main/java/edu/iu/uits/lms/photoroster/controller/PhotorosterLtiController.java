package edu.iu.uits.lms.photoroster.controller;

import canvas.helpers.CanvasConstants;
import edu.iu.uits.lms.common.session.CourseSessionService;
import edu.iu.uits.lms.lti.LTIConstants;
import edu.iu.uits.lms.lti.controller.LtiController;
import edu.iu.uits.lms.lti.security.LtiAuthenticationProvider;
import edu.iu.uits.lms.lti.security.LtiAuthenticationToken;
import edu.iu.uits.lms.photoroster.security.SessionUser;
import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.tsugi.basiclti.BasicLTIConstants;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by chmaurer on 11/13/14.
 */
@Controller
@RequestMapping("/lti")
@Slf4j
public class PhotorosterLtiController extends LtiController {

    @Autowired
    private CourseSessionService courseSessionService;

    @Override
    protected String getLaunchUrl(Map<String, String> launchParams) {
        String courseId = launchParams.get(CUSTOM_CANVAS_COURSE_ID);
        return "/app/" + courseId;
    }

    @Override
    protected Map<String, String> getParametersForLaunch(Map<String, String> payload, Claims claims) {
        Map<String, String> paramMap = new HashMap<String, String>(1);

        paramMap.put(CUSTOM_CANVAS_COURSE_ID, payload.get(CUSTOM_CANVAS_COURSE_ID));
        paramMap.put(BasicLTIConstants.ROLES, payload.get(BasicLTIConstants.ROLES));
        paramMap.put(BasicLTIConstants.USER_ID, payload.get(BasicLTIConstants.USER_ID));
        paramMap.put(CUSTOM_CANVAS_USER_ID, payload.get(CUSTOM_CANVAS_USER_ID));
        paramMap.put(CUSTOM_CANVAS_USER_LOGIN_ID, payload.get(CUSTOM_CANVAS_USER_LOGIN_ID));

        return paramMap;
    }

    @Override
    protected void preLaunchSetup(Map<String, String> launchParams, HttpServletRequest request, HttpServletResponse response) {
        SessionUser sessionUser = new SessionUser();
        sessionUser.setUsername(launchParams.get(BasicLTIConstants.USER_ID));
        sessionUser.setCanvasUserId(launchParams.get(CUSTOM_CANVAS_USER_ID));
        sessionUser.setCourseId(launchParams.get(CUSTOM_CANVAS_COURSE_ID));

        log.debug("User: " + sessionUser);

        String rolesString = launchParams.get(BasicLTIConstants.ROLES);
        String[] userRoles = rolesString.split(",");
        String authority = returnEquivalentAuthority(Arrays.asList(userRoles), getDefaultInstructorRoles());
        log.debug("LTI equivalent authority: " + authority);

        String userId = launchParams.get(CUSTOM_CANVAS_USER_LOGIN_ID);
        String systemId = launchParams.get(BasicLTIConstants.TOOL_CONSUMER_INSTANCE_GUID);
        String courseId = launchParams.get(CUSTOM_CANVAS_COURSE_ID);

        HttpSession session = request.getSession();
        courseSessionService.addAttributeToSession(session, courseId, "sessionUser", sessionUser);

        LtiAuthenticationToken token = new LtiAuthenticationToken(userId,
                courseId, systemId, AuthorityUtils.createAuthorityList(LtiAuthenticationProvider.LTI_USER_ROLE, authority), getToolContext());
        SecurityContextHolder.getContext().setAuthentication(token);
    }

    @Override
    protected String returnEquivalentAuthority(List<String> userRoles, List<String> instructorRoles) {
        for (String instructorRole : instructorRoles) {
            if (userRoles.contains(instructorRole)) {
                return LTIConstants.INSTRUCTOR_AUTHORITY;
            }
        }

        if (userRoles.contains(CanvasConstants.TA_ROLE)) {
            return LTIConstants.TA_AUTHORITY;
        }

        if (userRoles.contains(CanvasConstants.LEARNER_ROLE)) {
            return LTIConstants.STUDENT_AUTHORITY;
        }

        if (userRoles.contains(CanvasConstants.OBSERVER_ROLE)) {
            return LTIConstants.OBSERVER_AUTHORITY;
        }

        return LTIConstants.STUDENT_AUTHORITY;
    }

    @Override
    protected String getToolContext() {
        return "lms_photoroster";
    }

//    @Override
//    protected LAUNCH_MODE launchMode() {
//        return LAUNCH_MODE.FORWARD;
//    }
}
