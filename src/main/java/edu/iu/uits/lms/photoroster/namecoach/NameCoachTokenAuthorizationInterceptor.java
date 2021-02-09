package edu.iu.uits.lms.photoroster.namecoach;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.util.Assert;

import java.io.IOException;

@Slf4j
public class NameCoachTokenAuthorizationInterceptor implements ClientHttpRequestInterceptor {

    private final String token;

    /**
     * Create a new interceptor which adds an Authorization header
     * for the given token.
     * @param token the token to use
     */
    public NameCoachTokenAuthorizationInterceptor(String token) {
        Assert.hasLength(token, "token must not be empty");
        this.token = token;
    }

    @Override
    public ClientHttpResponse intercept(HttpRequest request, byte[] body,
                                        ClientHttpRequestExecution execution) throws IOException {
        request.getHeaders().add(HttpHeaders.AUTHORIZATION, token);
        return execution.execute(request, body);
    }
}
