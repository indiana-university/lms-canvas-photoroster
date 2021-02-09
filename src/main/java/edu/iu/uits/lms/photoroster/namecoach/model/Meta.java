package edu.iu.uits.lms.photoroster.namecoach.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class Meta {
   /*
     "meta": {
    "next_page_url": "https://www.name-coach.com/api/private/v4/participants?format=json&page=2&per_page=3",
    "self_url": "https://www.name-coach.com/api/private/v4/participants?format=json&page=1&per_page=3",
    "total_count": 9,
    "total_pages": 3,
    "count": 3
  }
    */

   @JsonProperty("next_page_url")
   private String nextPageUrl;

   @JsonProperty("self_url")
   private String selfUrl;

   @JsonProperty("total_count")
   private int totalCount;

   @JsonProperty("total_pages")
   private int totalPages;

   private int count;
}
