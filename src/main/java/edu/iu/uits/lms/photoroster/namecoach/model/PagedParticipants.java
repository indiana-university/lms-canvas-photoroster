package edu.iu.uits.lms.photoroster.namecoach.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PagedParticipants {
   private List<Participant> participants;
   private Meta meta;
}
