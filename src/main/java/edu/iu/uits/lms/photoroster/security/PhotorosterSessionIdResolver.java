package edu.iu.uits.lms.photoroster.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.session.web.http.CookieHttpSessionIdResolver;
import org.springframework.session.web.http.HeaderHttpSessionIdResolver;
import org.springframework.session.web.http.HttpSessionIdResolver;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

@Slf4j
public class PhotorosterSessionIdResolver implements HttpSessionIdResolver {

   private final CookieHttpSessionIdResolver cookieHttpSessionIdResolver;
   private final HeaderHttpSessionIdResolver headerHttpSessionIdResolver;
   private final String headerResolverPath;

   public PhotorosterSessionIdResolver(String headerResolverPath) {
      cookieHttpSessionIdResolver = new CookieHttpSessionIdResolver();
      headerHttpSessionIdResolver = HeaderHttpSessionIdResolver.xAuthToken();

      this.headerResolverPath = headerResolverPath;
   }

   @Override
   public List<String> resolveSessionIds(HttpServletRequest request) {
      List<String> sessionIds = getResolver(request).resolveSessionIds(request);
      log.trace("resolving sessionIds: {}", sessionIds);
      return sessionIds;
   }

   @Override
   public void setSessionId(HttpServletRequest request, HttpServletResponse response, String sessionId) {
      log.trace("Setting sessionId: {}", sessionId);
      getResolver(request).setSessionId(request, response, sessionId);
   }

   @Override
   public void expireSession(HttpServletRequest request, HttpServletResponse response) {
      log.trace("expiring session");
      getResolver(request).expireSession(request, response);
   }

   private HttpSessionIdResolver getResolver(HttpServletRequest request) {
      String requestURI = request.getRequestURI();
      if (requestURI.startsWith(headerResolverPath)) {
         log.trace("{}: {}", requestURI, "headerHttpSessionIdResolver");
         return headerHttpSessionIdResolver;
      }
      log.trace("{}: {}", requestURI, "cookieHttpSessionIdResolver");
      return cookieHttpSessionIdResolver;
   }
}
