package edu.iu.uits.lms.photoroster.namecoach.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;

@Data
@AllArgsConstructor
public class Participants {
   List<Participant> participants;

   @Accessors(fluent = true)
   boolean hasErrors;
}
