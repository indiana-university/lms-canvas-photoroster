package edu.iu.uits.lms.photoroster.crimsoncard.service;

/*-
 * #%L
 * photoroster
 * %%
 * Copyright (C) 2015 - 2025 Indiana University
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
