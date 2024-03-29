package edu.iu.uits.lms.photoroster.namecoach.service;

/*-
 * #%L
 * photoroster
 * %%
 * Copyright (C) 2015 - 2022 Indiana University
 * %%
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 * 
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 * 
 * 3. Neither the name of the Indiana University nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 * IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
 * OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 * #L%
 */

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.iu.uits.lms.photoroster.namecoach.config.NameCoachEnvironmentConfigTest;
import edu.iu.uits.lms.photoroster.namecoach.model.PagedParticipants;
import edu.iu.uits.lms.photoroster.namecoach.model.Participant;
import edu.iu.uits.lms.photoroster.namecoach.model.Participants;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.test.context.ContextConfiguration;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;


@ContextConfiguration(classes = {NameCoachEnvironmentConfigTest.class})
@Slf4j
@Profile("namecoach")
@Disabled
public class NameCoachServiceImplTest {

   @Autowired
   private NameCoachService nameCoachService = null;

   private static String USER1 = "leward@iu.edu";
   private static String USER2 = "chmaurer@iu.edu";
   private static String USER3 = "wagnermr@iu.edu";

   private static List<String> USERS_WITH_PRONOUNS = Arrays.asList(USER1, USER3);
   private static String PRONOUNS = "she / her / hers";

   @Test
   public void testGetParticipant() {
      Participant participant = nameCoachService.getParticipant(USER3);
      log.debug("{}", participant);
      Assertions.assertNotNull(participant);
   }

   @Test
   public void testGetParticipants() {
      Participants participantObj = nameCoachService.getParticipants(Collections.singletonList(USER1), false);
      List<Participant> participants = participantObj.getParticipants();
      log.debug("{}", participants);
      log.debug("Size: " + participants.size());
      Assertions.assertNotNull(participants);
      Assertions.assertFalse(participants.isEmpty());
      Assertions.assertTrue(participants.size() > 1);
      Assertions.assertEquals(34, participants.size());
   }

   @Test
   public void testGetUniqueParticipants() {
      Participants participantObj = nameCoachService.getParticipants(Collections.singletonList(USER1), true);
      List<Participant> participants = participantObj.getParticipants();
      log.debug("{}", participants);
      log.debug("Size: " + participants.size());
      Assertions.assertNotNull(participants);
      Assertions.assertFalse(participants.isEmpty());
      Assertions.assertEquals(1, participants.size());
   }

   @Test
   public void testGetParticipants2() {
      Participants participantObj = nameCoachService.getParticipants(Arrays.asList(USER1, USER2), false);
      List<Participant> participants = participantObj.getParticipants();
      log.debug("{}", participants);
      log.debug("Size: " + participants.size());
      Assertions.assertNotNull(participants);
      Assertions.assertFalse(participants.isEmpty());
      Assertions.assertTrue(participants.size() > 1);
      Assertions.assertEquals(36, participants.size());
   }

   @Test
   public void testGetUniqueParticipants2() {
      Participants participantObj = nameCoachService.getParticipants(Arrays.asList(USER1, USER2, USER3), true);
      List<Participant> participants = participantObj.getParticipants();
      log.debug("{}", participants);
      log.debug("Size: " + participants.size());
      Assertions.assertNotNull(participants);
      Assertions.assertFalse(participants.isEmpty());
      Assertions.assertEquals(3, participants.size());
   }


//   @Test
   // don't think this one is relevant, unless we get custom objects back in the future
//   public void testWithObject() throws Exception {
//      ObjectMapper objectMapper = Jackson2ObjectMapperBuilder.json().build();
//      Participant participant1 = new Participant("John", "Smith", "john@smith.com", "http://johnsmith.com/recording.mp3",
//            "http://johnsmith.com/badge.jpg", new Participant.CustomObjects());
//      Participant.CustomObjects customObjects = new Participant.CustomObjects();
//      customObjects.setGenderPronouns(PRONOUNS);
//      Participant participant2 = new Participant("Jane", "Doe", "jane@doe.com", "http://janedoe.com/recording.mp3",
//            "http://janedoe.com/badge.jpg", customObjects);
//      Meta meta = new Meta();
//      PagedParticipants inputObj = new PagedParticipants(Arrays.asList(participant1, participant2), meta);
//
//      String json = objectMapper.writeValueAsString(inputObj);
//      PagedParticipants stuff = objectMapper.readValue(json, PagedParticipants.class);
//
//      Assertions.assertNotNull(stuff);
//
//      for (Participant participant : stuff.getParticipants()) {
//         if ("jane@doe.com".equals(participant.getEmail())) {
//            Assertions.assertEquals(PRONOUNS, participant.getCustomObjects().getGenderPronouns());
//         } else {
//            Assertions.assertNull(participant.getCustomObjects().getGenderPronouns());
//         }
//      }
//   }

   @Test
   public void testWithJson() throws Exception {
      ObjectMapper objectMapper = Jackson2ObjectMapperBuilder.json().build();

      String json = "{\"participants\":[{\"first_name\":\"John\",\"last_name\":\"Smith\",\"email\":\"john@smith.com\",\"recording_link\":\"http://johnsmith.com/recording.mp3\"}],\"meta\":{\"self_url\":\"https://www.name-coach.com/api/private/v4/participants?email_list=john%40smith.com&format=json&page=1&per_page=100\",\"total_count\":19,\"total_pages\":1,\"count\":19}}";

      PagedParticipants stuff = objectMapper.readValue(json, PagedParticipants.class);

      Assertions.assertNotNull(stuff);
   }


}
