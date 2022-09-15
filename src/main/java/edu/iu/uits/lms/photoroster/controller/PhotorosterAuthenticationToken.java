package edu.iu.uits.lms.photoroster.controller;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;
import uk.ac.ox.ctl.lti13.security.oauth2.client.lti.authentication.OidcAuthenticationToken;

import java.util.Collection;

// TODO may not need this file at all
public class PhotorosterAuthenticationToken extends OidcAuthenticationToken {

   public PhotorosterAuthenticationToken(Object principal, String context, String systemId, Collection<? extends GrantedAuthority> authorities, String toolId) {
      super((OAuth2User) principal, authorities, toolId, systemId);
   }

   @Override
   public String getName() {
      // oauth2 with WebClient has a thing where it's expecting a principalName, even if it does not really use or care
      // about it. So this exists just to have something for the name.
      return "foo";
   }
}
