package edu.iu.uits.lms.photoroster.model;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class EnrollmentModel {
   private String userId;
   private String sectionId;
   private String sectionName;
   private String roleType;
   private String roleName;
   private String roleGroupName;
   private int roleGroupSortKey;
   private int roleSortKey;
   private boolean badgeble;
   private List<String> groupMemberships = new ArrayList<>();

}
