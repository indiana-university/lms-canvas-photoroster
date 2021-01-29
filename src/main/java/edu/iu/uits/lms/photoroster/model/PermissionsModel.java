package edu.iu.uits.lms.photoroster.model;

import lombok.Data;

@Data
public class PermissionsModel {
   private boolean canSeeExport;
   private boolean canSeeSigninView;
   private boolean canSeeFerpa;
   private boolean canSeeOfficialPhotos;
}
