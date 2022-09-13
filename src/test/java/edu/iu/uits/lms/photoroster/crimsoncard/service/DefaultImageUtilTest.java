package edu.iu.uits.lms.photoroster.crimsoncard.service;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.context.annotation.Configuration;
import org.springframework.test.context.ContextConfiguration;

@ContextConfiguration
@Slf4j
public class DefaultImageUtilTest {

   @Test
   public void getDefaultImageOrig() {
      byte[] bytes = DefaultImageUtil.getDefaultImage(CrimsonCardPhotoService.CCAttributes.SIZE.ORIGINAL);
      Assertions.assertNotNull(bytes);
      Assertions.assertNotEquals(new byte[0], bytes);
      Assertions.assertEquals(6027, bytes.length);
   }

   @Test
   public void getDefaultImage64() {
      byte[] bytes = DefaultImageUtil.getDefaultImage(CrimsonCardPhotoService.CCAttributes.SIZE.S64X64);
      Assertions.assertNotNull(bytes);
      Assertions.assertNotEquals(new byte[0], bytes);
      Assertions.assertEquals(2442, bytes.length);
   }

   @Test
   public void getDefaultImage75() {
      byte[] bytes = DefaultImageUtil.getDefaultImage(CrimsonCardPhotoService.CCAttributes.SIZE.S75X100);
      Assertions.assertNotNull(bytes);
      Assertions.assertNotEquals(new byte[0], bytes);
      Assertions.assertEquals(3193, bytes.length);
   }

   @Test
   public void getDefaultImage240() {
      byte[] bytes = DefaultImageUtil.getDefaultImage(CrimsonCardPhotoService.CCAttributes.SIZE.S240X320);
      Assertions.assertNotNull(bytes);
      Assertions.assertNotEquals(new byte[0], bytes);
      Assertions.assertEquals(10922, bytes.length);
   }

   @Test
   public void getDefaultImage480() {
      byte[] bytes = DefaultImageUtil.getDefaultImage(CrimsonCardPhotoService.CCAttributes.SIZE.S480X640);
      Assertions.assertNotNull(bytes);
      Assertions.assertNotEquals(new byte[0], bytes);
      Assertions.assertEquals(24343, bytes.length);
   }
   @Configuration
   static class DefaultImageUtilTestContextConfiguration {

   }
}
