//package edu.iu.uits.lms.photoroster.crimsoncard.service;
//
//import lombok.extern.slf4j.Slf4j;
//import org.junit.Assert;
//import org.junit.Test;
//import org.junit.runner.RunWith;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.test.context.ContextConfiguration;
//import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
//
////@RunWith(SpringJUnit4ClassRunner.class)
//@ContextConfiguration
//@Slf4j
//public class DefaultImageUtilTest {
//
//   @Test
//   public void getDefaultImageOrig() {
//      byte[] bytes = DefaultImageUtil.getDefaultImage(CrimsonCardPhotoService.CCAttributes.SIZE.ORIGINAL);
//      Assert.assertNotNull(bytes);
//      Assert.assertNotEquals(new byte[0], bytes);
//      Assert.assertEquals(6027, bytes.length);
//   }
//
//   @Test
//   public void getDefaultImage64() {
//      byte[] bytes = DefaultImageUtil.getDefaultImage(CrimsonCardPhotoService.CCAttributes.SIZE.S64X64);
//      Assert.assertNotNull(bytes);
//      Assert.assertNotEquals(new byte[0], bytes);
//      Assert.assertEquals(2442, bytes.length);
//   }
//
//   @Test
//   public void getDefaultImage75() {
//      byte[] bytes = DefaultImageUtil.getDefaultImage(CrimsonCardPhotoService.CCAttributes.SIZE.S75X100);
//      Assert.assertNotNull(bytes);
//      Assert.assertNotEquals(new byte[0], bytes);
//      Assert.assertEquals(3193, bytes.length);
//   }
//
//   @Test
//   public void getDefaultImage240() {
//      byte[] bytes = DefaultImageUtil.getDefaultImage(CrimsonCardPhotoService.CCAttributes.SIZE.S240X320);
//      Assert.assertNotNull(bytes);
//      Assert.assertNotEquals(new byte[0], bytes);
//      Assert.assertEquals(10922, bytes.length);
//   }
//
//   @Test
//   public void getDefaultImage480() {
//      byte[] bytes = DefaultImageUtil.getDefaultImage(CrimsonCardPhotoService.CCAttributes.SIZE.S480X640);
//      Assert.assertNotNull(bytes);
//      Assert.assertNotEquals(new byte[0], bytes);
//      Assert.assertEquals(24343, bytes.length);
//   }
//   @Configuration
//   static class DefaultImageUtilTestContextConfiguration {
//
//   }
//}
