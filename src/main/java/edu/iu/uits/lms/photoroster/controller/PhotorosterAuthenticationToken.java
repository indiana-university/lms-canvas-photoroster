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
      // oauth2 with WebClient has a thing where it's expecting a principalName, even if it does not really use or care
      // about it. So this exists just to have something for the name.
      return "foo";
   }
}
