package edu.iu.uits.lms.photoroster.service;

import canvas.client.generated.api.AccountsApi;
import canvas.client.generated.api.CoursesApi;
import canvas.client.generated.api.GroupsApi;
import canvas.client.generated.model.Account;
import canvas.client.generated.model.CanvasRole;
import canvas.client.generated.model.Course;
import canvas.client.generated.model.CourseGroup;
import canvas.client.generated.model.Enrollment;
import canvas.client.generated.model.Section;
import canvas.client.generated.model.User;
import canvas.helpers.EnrollmentHelper;
import edu.iu.uits.lms.lti.LTIConstants;
import edu.iu.uits.lms.photoroster.PhotorosterConstants;
import edu.iu.uits.lms.photoroster.config.ToolConfig;
import edu.iu.uits.lms.photoroster.crimsoncard.service.CrimsonCardPhotoService;
import edu.iu.uits.lms.photoroster.crimsoncard.service.DefaultImageUtil;
import edu.iu.uits.lms.photoroster.model.BackingModel;
import edu.iu.uits.lms.photoroster.model.EnrollmentModel;
import edu.iu.uits.lms.photoroster.model.PermissionsModel;
import edu.iu.uits.lms.photoroster.model.PersonModel;
import edu.iu.uits.lms.photoroster.namecoach.model.Participant;
import edu.iu.uits.lms.photoroster.namecoach.model.Participants;
import edu.iu.uits.lms.photoroster.namecoach.service.NameCoachService;
import iuonly.client.generated.api.FeatureAccessApi;
import iuonly.client.generated.api.SudsApi;
import iuonly.client.generated.model.ListWrapper;
import iuonly.client.generated.model.SudsFerpaEntry;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.TreeMap;
import java.util.stream.Collectors;

import static canvas.helpers.EnrollmentHelper.TYPE_TEACHER;
import static edu.iu.uits.lms.photoroster.crimsoncard.service.CrimsonCardPhotoService.CCAttributes.SIZE.S240X320;
import static edu.iu.uits.lms.photoroster.crimsoncard.service.CrimsonCardPhotoService.CCAttributes.SIZE.S75X100;

@Service
@Slf4j
public class PhotorosterService {

    public static final String UNGROUPED_ID = "UNGROUPED";

    @Autowired
    private ToolConfig toolConfig = null;

    @Autowired
    private CoursesApi courseService = null;

    @Autowired
    private SudsApi sudsService = null;

    @Autowired
    private AccountsApi accountService = null;

    @Autowired
    private CrimsonCardPhotoService crimsonCardPhotoService = null;

    @Autowired
    private NameCoachService nameCoachService = null;

    @Autowired
    private FeatureAccessApi featureAccessService = null;

    @Autowired
    private GroupsApi groupService = null;

    @Autowired
    @Qualifier("PhotorosterCacheManager")
    private CacheManager cacheManager;

    @Cacheable(PhotorosterConstants.COURSE_CACHE)
    public Course getCourse(String courseId) {
        log.debug("course lookup");
        return courseService.getCourse(courseId);
    }

    @Cacheable(PhotorosterConstants.FERPA_CACHE)
    public Map<String, String> getFerpaMap(List<User> users) {
        log.debug("build ferpa map");
        // Convert users into a List of Strings
        List<String> ids = users.stream()
                .filter(u-> u.getLoginId() != null)
                .map(User::getLoginId)
                .collect(Collectors.toList());

        List<SudsFerpaEntry> sudsFerpaEntries = new ArrayList<>();

        // No need to make a database call if there's no users for an enrollment lookup!
        if (!ids.isEmpty()) {
            sudsFerpaEntries = sudsService.getFerpaEntriesByListOfSisUserIds(new ListWrapper().listItems(ids), true);
        }
        log.debug("Ferpa Entries: " + sudsFerpaEntries.size());

        // convert the list to a map
        return sudsFerpaEntries.stream().collect(
                Collectors.toMap(SudsFerpaEntry::getIuImsUsername, SudsFerpaEntry::getFerpa));
    }

    @Cacheable(value = PhotorosterConstants.ROLES_CACHE)
    public Map<String, String> getCanvasRoleMap(String accountId) {
        List<CanvasRole> canvasRoles;
        //TODO This if check an probably go away when we remove the old photoroster
        if (accountId == null) {
            canvasRoles = accountService.getAllRoles();
        } else {
            canvasRoles = accountService.getRolesForAccount(accountId, true);
        }
        log.debug("Roles: " + canvasRoles.size());

        return canvasRoles.stream()
                .collect(Collectors.toMap(CanvasRole::getRole, CanvasRole::getLabel));
    }

    @Cacheable(PhotorosterConstants.COURSESECTIONS_CACHE)
    public Map<String, String> getSectionMap(String courseId) {
        Map<String, String> sectionMap = new TreeMap<>();
        List<Section> sections = courseService.getCourseSections(courseId);
        if (sections != null) {
            log.debug("Sections: " + sections.size());
            sectionMap = sections.stream()
                    .sorted(Comparator.comparing(Section::getName))
                    .collect(Collectors.toMap(Section::getId, Section::getName, (a, b) -> b,
                            TreeMap::new));
        }
        return sectionMap;
    }

    @Cacheable(PhotorosterConstants.COURSEGROUPS_CACHE)
    public Map<String, String> getCourseGroupMap(String courseId) {
        Map<String, String> groupMap = new LinkedHashMap<>();
        List<CourseGroup> groups = groupService.getGroupsForCourse(courseId);
        if (groups != null) {
            log.debug("Groups: " + groups.size());
            groupMap = groups.stream()
                    .sorted(Comparator.comparing(CourseGroup::getName))
                    .collect(Collectors.toMap(CourseGroup::getId, CourseGroup::getName, (a, b) -> b,
                            LinkedHashMap::new));
        }
        return groupMap;
    }

    @Cacheable(PhotorosterConstants.COURSEROSTER_CACHE)
    public List<User> getRosterForCourse(String courseId, String currentUser) {
        List<String> enrollmentStates = Arrays.asList(EnrollmentHelper.STATE.active.name(), EnrollmentHelper.STATE.invited.name());
        List<String> enrollmentTypes = Arrays.stream(EnrollmentHelper.TYPE.values())
              .map(EnrollmentHelper.TYPE::name)
              .collect(Collectors.toList());

        List<User> users = courseService.getRosterForCourseAsUser(courseId, currentUser, enrollmentStates);
        if (users == null) {
            users = new ArrayList<User>();
        } else {
            // In some scenarios (such as a Locked course), login_id is not included in the returned User info.
            // This prevents the photos from being displayed, so we need to verify the login_id was included in the returned
            // results and populate it if missing.
            boolean loginIdMissing = users.stream().anyMatch(user -> user.getLoginId() == null);

            if (loginIdMissing) {
                populateUserLoginInfo(users, courseId, enrollmentStates, enrollmentTypes);
            }
        }

        return users;
    }

    private Map<String, String> loadUserImageMap(List<User> users, String accountId, CrimsonCardPhotoService.CCAttributes.SIZE size) {
        List<String> ids = users.stream()
                .map(User::getLoginId)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        return loadUserImageMapByIds(ids, accountId, size);
    }

    public Map<String, String> loadUserImageMapByIds(List<String> userIds, String accountId, CrimsonCardPhotoService.CCAttributes.SIZE size) {
        return crimsonCardPhotoService.getImageUrls(userIds,
                  CrimsonCardPhotoService.CCAttributes.ID_TYPE.NETWORK_ID, size);
    }

    /**
     * Populate the given users list with login_id
     * @param users List of users that need login_id populated
     * @param courseId
     * @param enrollmentStates
     */
    private void populateUserLoginInfo(List<User> users, String courseId, List<String> enrollmentStates, List<String> enrollmentTypes) {
        // retrieve all user info for this course and put it in a map for easy access. The info returned isn't
        // restricted by the current user
        Map<String, String> canvasIdLoginIdMap = new HashMap<String, String>();
        List<User> allUserInfo = courseService.getUsersForCourseByType(courseId, enrollmentTypes, enrollmentStates);
        if (allUserInfo != null) {
            for (User userInfo : allUserInfo) {
                canvasIdLoginIdMap.put(userInfo.getId(), userInfo.getLoginId());
            }
        }

        // Now iterate through our roster and populate the missing login_id
        for (User user : users) {
            if (user.getLoginId() == null && canvasIdLoginIdMap.containsKey(user.getId())) {
                // populate the missing login_id
                user.setLoginId(canvasIdLoginIdMap.get(user.getId()));
            }
        }
    }

    public String[] getPhotorosterRoleGroupings() {
        return toolConfig.getRoleGroupings();
    }

    public BackingModel buildBackingModel(String courseId, String currentUserId, HttpServletRequest request) {
        List<User> users = getRosterForCourse(courseId, currentUserId);
        Course course = getCourse(courseId);
        Map<String, String> smallUserImageMap = Collections.EMPTY_MAP;
        Map<String, String> mediumUserImageMap = Collections.EMPTY_MAP;
        List<String> errorMessages = new ArrayList<>();

        PermissionsModel permissionsModel = buildPermissionsModel(request, course);

        if (permissionsModel.isCanSeeOfficialPhotos()) {
            smallUserImageMap = loadUserImageMap(users, course.getAccountId(), S75X100);
            mediumUserImageMap = loadUserImageMap(users, course.getAccountId(), S240X320);
        }

        List<String> emails = users.stream()
              .map(User::getEmail)
              .filter(Objects::nonNull)
              .collect(Collectors.toList());

        Participants participants = nameCoachService.getParticipants(emails, true);
        List<Participant> nameCoachResults = participants.getParticipants();
        if (participants.hasErrors()) {
            errorMessages.add("The Namecoach service encountered some errors.  Some name recordings may be missing.");
        }

        // Filter out records with no useful data. We are looking for a recording
        List<Participant> filteredNCResults = nameCoachResults.stream()
              .filter(nc -> nc.getRecordingLink() != null)
              .collect(Collectors.toList());

        // convert the list to a map
        Map<String, Participant> nameCoachMap = new HashMap<>();
        if (!filteredNCResults.isEmpty()) {
            nameCoachMap = filteredNCResults.stream().collect(
                  Collectors.toMap(Participant::getEmail, participant -> participant, (a, b) -> b));
        }


        Map<String, String> roleMap = getCanvasRoleMap(course.getAccountId());
        Map<String, String> sectionMap = getSectionMap(courseId);
        Map<String, String> ferpaMap = getFerpaMap(users);
        Map<String, String> courseGroupMap = getCourseGroupMap(courseId);
        String[] roleGroupings = getPhotorosterRoleGroupings();
        List<String> roleGroupingList = Arrays.asList(roleGroupings);

        // retrieve the group memberships
//        Map<String, List<User>> groupIdMembershipMap = new HashMap<>();
        Map<String, List<String>> userIdGroupMembershipMap = new HashMap<>();
        boolean courseHasGroups = courseGroupMap != null && !courseGroupMap.isEmpty();
        if (courseHasGroups) {
            for (String groupId : courseGroupMap.keySet()) {
                List<User> groupMembers = groupService.getUsersInGroup(groupId, false);
//                groupIdMembershipMap.put(groupId, groupMembers);

                for (User user : groupMembers) {
                    List<String> groupMemberships = new ArrayList<>();
                    if (userIdGroupMembershipMap.containsKey(user.getId())) {
                        groupMemberships = userIdGroupMembershipMap.get(user.getId());
                    }

                    groupMemberships.add(groupId);
                    userIdGroupMembershipMap.put(user.getId(), groupMemberships);
                }
            }
        }

        List<PersonModel> personModelList = new ArrayList<>();
        List<EnrollmentModel> enrollmentModelList = new ArrayList<>();
        byte[] smallDefaultImage = DefaultImageUtil.getDefaultImage(S75X100);
        byte[] mediumDefaultImage = DefaultImageUtil.getDefaultImage(S240X320);
        for (User user: users) {
            boolean isFerpaRestricted = isUserFerpaRestricted(user, ferpaMap);

            // If you aren't an instructor, you shouldn't see ferpa restricted users
            if (!isFerpaRestricted || permissionsModel.isCanSeeFerpa()) {
                PersonModel pm = new PersonModel(user);
                pm.setFerpaRestricted(isFerpaRestricted);

                //Get the various images
                String smallImageData = resolveImage(smallUserImageMap.get(user.getLoginId()), smallDefaultImage);
                String mediumImageData = resolveImage(mediumUserImageMap.get(user.getLoginId()), mediumDefaultImage);

                String canvasAvatarImageData = user.getAvatarUrl();

                pm.getImageMap().put(S75X100.getValue(), smallImageData);
                pm.getImageMap().put(S240X320.getValue(), mediumImageData);
                pm.getImageMap().put("CanvasAvatar", canvasAvatarImageData);

                if (user.getEmail() != null) {
                    Participant participant = nameCoachMap.get(user.getEmail());

                    if (participant != null) {
                        pm.setRecordingUrl(participant.getRecordingLink());
                    }
                }

                if (user.getPronouns() != null) {
                    pm.setPreferredPronouns(user.getPronouns());
                }

                // Check to see if user is a member of any groups. If not, add them to the UNGROUPED group
                if (courseHasGroups && !userIdGroupMembershipMap.containsKey(user.getId())) {
                    userIdGroupMembershipMap.put(user.getId(), Arrays.asList(UNGROUPED_ID));
                }

                personModelList.add(pm);

                // Go through all the enrollments, but store them in their own separate structure
                for (Enrollment enr : user.getEnrollments()) {
                    EnrollmentModel sri = new EnrollmentModel();
                    sri.setUserId(user.getId());
                    sri.setSectionId(enr.getCourseSectionId());
                    sri.setSectionName(sectionMap.get(enr.getCourseSectionId()));
                    sri.setRoleType(enr.getType());
                    sri.setRoleName(roleMap.get(enr.getRole()));
                    sri.setBadgeble(enr.getType().equals(TYPE_TEACHER));

                    //Get the group for the role
                    sri.setRoleGroupName(roleMap.get(enr.getType()));

                    //Get the index of the group so we can sort it in the UI
                    sri.setRoleGroupSortKey(roleGroupingList.indexOf(enr.getType()));

                    // Add the user's group memberships
                    if (courseHasGroups) {
                        sri.setGroupMemberships(userIdGroupMembershipMap.get(user.getId()));
                    }

                    //Get the index of the role so we can sort it in the UI
//                sri.setRoleSortKey(roleGroupings.get(roleGroupKey).indexOf(enr.getRole()));
                    enrollmentModelList.add(sri);
                }
            }
        }

        //Sort by the group and then role
        enrollmentModelList.sort(Comparator.comparing(EnrollmentModel::getRoleGroupSortKey)
              .thenComparing(EnrollmentModel::getRoleName));
        return new BackingModel(personModelList, enrollmentModelList, new PersonModel(new User()), course.getName(),
              permissionsModel, errorMessages);
    }

    /**
     * If the url is legit, use it.  If not, decorate the byte[] so that it can be used an an inline image
     * @param url Remote image to display
     * @param placeholderImage Alternate image if there happens to be no url
     * @return Either the url, or a decorated byte[]
     */
    private String resolveImage(String url, byte[] placeholderImage) {
        if (url != null) {
            return url;
        } else {
            return "data:image/jpeg;base64," + Base64.encodeBase64String(placeholderImage);
        }
    }

    /**
     * Has this user invoked FERPA restrictions?
     * @return true/false
     */
    protected boolean isUserFerpaRestricted(User user, Map<String, String> ferpaEntries) {
        boolean ferpaRestricted = false;
        String username = user.getLoginId();

        if ("Y".equals(ferpaEntries.get(username))) {
            ferpaRestricted = true;
        }

        return ferpaRestricted;
    }

    /**
     * Setup the permissions model based on the role
     * @param request
     * @return
     */
    private PermissionsModel buildPermissionsModel(HttpServletRequest request, Course course) {
        final String FEATURE_OVERRIDE = "photoroster.showOfficialPhoto.override";
        final String FEATURE_OVERRIDE_WITH_SISID = "photoroster.showOfficialPhoto.override.withSisId";
        PermissionsModel pm = new PermissionsModel();

        boolean isInstructor = request.isUserInRole(LTIConstants.INSTRUCTOR_AUTHORITY);
        boolean isTa = request.isUserInRole(LTIConstants.TA_AUTHORITY);

        boolean isSisSite = false;
        boolean override = false;

        // if isInstructor is already false, don't bother checking if the course is an official SIS site
        if (isInstructor) {
            if (course != null) {
                String sisCourseId = course.getSisCourseId();
                List<Account> parentAccounts = accountService.getParentAccounts(course.getAccountId());
                List<String> parentAccountIds = parentAccounts.stream().map(Account::getId).collect(Collectors.toList());
                if (sisCourseId != null && !sisCourseId.isEmpty() &&
                      course.getTerm() != null && course.getTerm().getSisTermId() != null && !course.getTerm().getSisTermId().isEmpty()) {
                    // see if this a legit SIS course
                    isSisSite = sudsService.isLegitSisCourse(sisCourseId, course.getTerm().getSisTermId());

                    // See if we want to override and show official photos anyway
                    override = featureAccessService.isFeatureEnabledForAccount(FEATURE_OVERRIDE_WITH_SISID, course.getAccountId(), parentAccountIds);
                } else {
                    // Override even though there is no sis course id
                    override = featureAccessService.isFeatureEnabledForAccount(FEATURE_OVERRIDE, course.getAccountId(), parentAccountIds);
                }
            }
        }

        pm.setCanSeeExport(isInstructor);
        pm.setCanSeeFerpa(isInstructor);
        pm.setCanSeeOfficialPhotos(isInstructor && (isSisSite || override));
        pm.setCanSeeSigninView(isInstructor || isTa);

        return pm;
    }
}
