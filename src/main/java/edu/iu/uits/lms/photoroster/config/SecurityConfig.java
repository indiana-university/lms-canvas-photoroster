package edu.iu.uits.lms.photoroster.config;

import edu.iu.uits.lms.lti.repository.DefaultInstructorRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import uk.ac.ox.ctl.lti13.Lti13Configurer;

import static edu.iu.uits.lms.lti.LTIConstants.BASE_USER_ROLE;
import static edu.iu.uits.lms.lti.LTIConstants.WELL_KNOWN_ALL;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Configuration
    @Order(SecurityProperties.BASIC_AUTH_ORDER - 4)
    public static class AppWebSecurityConfigurerAdapter extends WebSecurityConfigurerAdapter {

        @Autowired
        private DefaultInstructorRoleRepository defaultInstructorRoleRepository;

        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http
                    .requestMatchers()
                    .antMatchers(WELL_KNOWN_ALL, "/error", "/app/**", "/api/**")
                    .and()
                    .authorizeRequests()
                    .antMatchers("/api/**").permitAll()
                    .antMatchers(WELL_KNOWN_ALL, "/error").permitAll()
                    .antMatchers("/**").hasRole(BASE_USER_ROLE);

            //Setup the LTI handshake
            Lti13Configurer lti13Configurer = new Lti13Configurer()
                    .grantedAuthoritiesMapper(new CustomRoleMapper(defaultInstructorRoleRepository));

            http.apply(lti13Configurer);

            http.exceptionHandling().accessDeniedPage("/app/accessDenied");

            //Fallback for everything else
            http.requestMatchers().antMatchers("/**")
                    .and()
                    .authorizeRequests()
                    .anyRequest().authenticated();
        }

        @Override
        public void configure(WebSecurity web) throws Exception {
            // ignore everything except paths specified
            web.ignoring().antMatchers("/app/jsrivet/**", "/app/webjars/**", "/actuator/**", "/app/css/**",
                    "/app/js/**", "/app/font/**", "/app/images/**", "/favicon.ico", "/app/jsreact/**", "/error");
        }
    }

    @Configuration
    @Order(SecurityProperties.BASIC_AUTH_ORDER - 2)
    public static class CatchAllSecurityConfig extends WebSecurityConfigurerAdapter {

        @Override
        public void configure(HttpSecurity http) throws Exception {
            http.requestMatchers().antMatchers("/**")
                  .and()
                  .authorizeRequests()
                  .anyRequest().authenticated();
        }

        @Override
        public void configure(WebSecurity web) throws Exception {
            web.ignoring().antMatchers("/actuator/**", "/error");
        }
    }
}
