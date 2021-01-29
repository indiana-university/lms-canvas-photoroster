package edu.iu.uits.lms.photoroster.namecoach.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Participant {
   /*
       {
      "first_name": "John",
      "last_name": "Snow",
      "email": "buster_test2@example.com",
      "recording_link": null,
      "event_title": "Example Api Event",
      "event_slug": "example-api-event",
      "event_access_code": "3A0CB",
      "institution_id": null,
      "photo": "https://www.name-coach.com/images/photo-blank.gif",
      "name_badge_link": "https://www.name-coach.com/john-snow-13014cd1-4d53-4995-bb83-a17bcafff9fa",
      "custom_objects": {
        "gender_pronouns": "they / them / theirs"
      }
    },
    */

   @JsonProperty("first_name")
   private String firstName;

   @JsonProperty("last_name")
   private String lastName;

   private String email;

   @JsonProperty("recording_link")
   private String recordingLink;

   @JsonProperty("name_badge_link")
   private String nameBadgeLink;

   @JsonProperty("custom_objects")
   private CustomObjects customObjects;

   @Data
   public static class CustomObjects {
      @JsonProperty("gender_pronouns")
      private String genderPronouns;
   }
}
