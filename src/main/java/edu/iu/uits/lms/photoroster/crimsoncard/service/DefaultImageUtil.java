package edu.iu.uits.lms.photoroster.crimsoncard.service;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;

import java.io.IOException;
import java.io.InputStream;
import java.text.MessageFormat;

@Slf4j
public class DefaultImageUtil {

   private DefaultImageUtil() {
      throw new IllegalStateException("Utility class");
   }

   /**
    * Get the default silhouette for a given image size
    * @param size Size of image to lookup
    * @return The image bytes
    */
   public static byte[] getDefaultImage(CrimsonCardPhotoService.CCAttributes.SIZE size) {
      String fileName = MessageFormat.format("static/silhouettes/silhouette_{0}.jpg", size.getValue());
      InputStream inputStream = DefaultImageUtil.class.getClassLoader().getResourceAsStream(fileName);
      byte[] bytes = new byte[0];

      try {
         bytes = IOUtils.toByteArray(inputStream);
      } catch (IOException e) {
         log.error("Unable to load default image for " + size.getValue(), e);
      }
      return bytes;
   }
}
