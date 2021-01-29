package edu.iu.uits.lms.photoroster.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class BackingModel {

   List<PersonModel> personModelList;
   List<EnrollmentModel> enrollmentModelList;

   //Need an empty object so we can reset the modal on close to prevent remnant data when opening for a different user
   PersonModel emptyUser;

   String courseTitle;

   PermissionsModel permissionsModel;

   List<String> errorMessages;
}
