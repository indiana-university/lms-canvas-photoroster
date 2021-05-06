package edu.iu.uits.lms.photoroster.namecoach.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.iu.uits.lms.photoroster.namecoach.config.NameCoachEnvironmentConfigTest;
import edu.iu.uits.lms.photoroster.namecoach.model.Meta;
import edu.iu.uits.lms.photoroster.namecoach.model.PagedParticipants;
import edu.iu.uits.lms.photoroster.namecoach.model.Participant;
import edu.iu.uits.lms.photoroster.namecoach.model.Participants;
import lombok.extern.slf4j.Slf4j;
import org.junit.Assert;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;


@ContextConfiguration(classes = {NameCoachEnvironmentConfigTest.class})
@RunWith(SpringJUnit4ClassRunner.class)
@Slf4j
@Ignore
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
      Assert.assertNotNull(participant);
      Assert.assertEquals(PRONOUNS, participant.getCustomObjects().getGenderPronouns());

      // test without pronouns
      participant = nameCoachService.getParticipant(USER2);
      log.debug("{}", participant);
      Assert.assertNotNull(participant);
      Assert.assertNull(participant.getCustomObjects().getGenderPronouns());
   }

   @Test
   public void testGetParticipants() {
      Participants participantObj = nameCoachService.getParticipants(Collections.singletonList(USER1), false);
      List<Participant> participants = participantObj.getParticipants();
      log.debug("{}", participants);
      log.debug("Size: " + participants.size());
      Assert.assertNotNull(participants);
      Assert.assertFalse(participants.isEmpty());
      Assert.assertTrue(participants.size() > 1);
      Assert.assertEquals(34, participants.size());
      Assert.assertEquals(PRONOUNS, participants.get(0).getCustomObjects().getGenderPronouns());
   }

   @Test
   public void testGetUniqueParticipants() {
      Participants participantObj = nameCoachService.getParticipants(Collections.singletonList(USER1), true);
      List<Participant> participants = participantObj.getParticipants();
      log.debug("{}", participants);
      log.debug("Size: " + participants.size());
      Assert.assertNotNull(participants);
      Assert.assertFalse(participants.isEmpty());
      Assert.assertEquals(1, participants.size());
      Assert.assertEquals(PRONOUNS, participants.get(0).getCustomObjects().getGenderPronouns());
   }

   @Test
   public void testGetParticipants2() {
      Participants participantObj = nameCoachService.getParticipants(Arrays.asList(USER1, USER2), false);
      List<Participant> participants = participantObj.getParticipants();
      log.debug("{}", participants);
      log.debug("Size: " + participants.size());
      Assert.assertNotNull(participants);
      Assert.assertFalse(participants.isEmpty());
      Assert.assertTrue(participants.size() > 1);
      Assert.assertEquals(36, participants.size());

      for (Participant participant : participants) {
         if (USERS_WITH_PRONOUNS.contains(participant.getEmail())) {
            Assert.assertEquals(PRONOUNS, participant.getCustomObjects().getGenderPronouns());
         } else {
            Assert.assertNull(participant.getCustomObjects().getGenderPronouns());
         }
      }
   }

   @Test
   public void testGetUniqueParticipants2() {
      Participants participantObj = nameCoachService.getParticipants(Arrays.asList(USER1, USER2, USER3), true);
      List<Participant> participants = participantObj.getParticipants();
      log.debug("{}", participants);
      log.debug("Size: " + participants.size());
      Assert.assertNotNull(participants);
      Assert.assertFalse(participants.isEmpty());
      Assert.assertEquals(3, participants.size());
      for (Participant participant : participants) {
         if (USERS_WITH_PRONOUNS.contains(participant.getEmail())) {
            Assert.assertEquals(PRONOUNS, participant.getCustomObjects().getGenderPronouns());
         } else {
            Assert.assertNull(participant.getCustomObjects().getGenderPronouns());
         }
      }
   }


   @Test
   public void testWithObject() throws Exception {
      ObjectMapper objectMapper = Jackson2ObjectMapperBuilder.json().build();
      Participant participant1 = new Participant("John", "Smith", "john@smith.com", "http://johnsmith.com/recording.mp3",
            "http://johnsmith.com/badge.jpg", new Participant.CustomObjects());
      Participant.CustomObjects customObjects = new Participant.CustomObjects();
      customObjects.setGenderPronouns(PRONOUNS);
      Participant participant2 = new Participant("Jane", "Doe", "jane@doe.com", "http://janedoe.com/recording.mp3",
            "http://janedoe.com/badge.jpg", customObjects);
      Meta meta = new Meta();
      PagedParticipants inputObj = new PagedParticipants(Arrays.asList(participant1, participant2), meta);

      String json = objectMapper.writeValueAsString(inputObj);
      PagedParticipants stuff = objectMapper.readValue(json, PagedParticipants.class);

      Assert.assertNotNull(stuff);

      for (Participant participant : stuff.getParticipants()) {
         if ("jane@doe.com".equals(participant.getEmail())) {
            Assert.assertEquals(PRONOUNS, participant.getCustomObjects().getGenderPronouns());
         } else {
            Assert.assertNull(participant.getCustomObjects().getGenderPronouns());
         }
      }
   }

   @Test
   public void testWithJson() throws Exception {
      ObjectMapper objectMapper = Jackson2ObjectMapperBuilder.json().build();

      String json = "{\"participants\":[{\"first_name\":\"John\",\"last_name\":\"Smith\",\"email\":\"john@smith.com\",\"recording_link\":\"http://johnsmith.com/recording.mp3\"}],\"meta\":{\"self_url\":\"https://www.name-coach.com/api/private/v4/participants?email_list=john%40smith.com&format=json&page=1&per_page=100\",\"total_count\":19,\"total_pages\":1,\"count\":19}}";

      PagedParticipants stuff = objectMapper.readValue(json, PagedParticipants.class);

      Assert.assertNotNull(stuff);
   }


}
