package edu.iu.uits.lms.photoroster.controller;

import edu.iu.uits.lms.lti.security.LtiAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class PhotorosterAuthenticationToken extends LtiAuthenticationToken {

   public PhotorosterAuthenticationToken(Object principal, String context, String systemId, Collection<? extends GrantedAuthority> authorities, String toolId) {
      super(principal, context, systemId, authorities, toolId);
   }

   @Override
   public String getName() {
      return "foo";
   }
}
