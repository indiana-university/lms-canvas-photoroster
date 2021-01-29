package edu.iu.uits.lms.photoroster.model;

import canvas.client.generated.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class PersonModel {
   @NonNull
   private User user;
   private boolean ferpaRestricted;
   private String roleString;

   private boolean isInTeacherRoleGrouping;

   private Map<String, String> imageMap = new HashMap<>();

   private String recordingUrl;
   private String preferredPronouns;

}
