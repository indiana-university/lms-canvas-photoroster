package edu.iu.uits.lms.photoroster.crimsoncard;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.util.Assert;
import org.springframework.util.Base64Utils;

import java.io.IOException;

@Slf4j
public class CrimsonCardTokenAccessRequestAuthorizationInterceptor implements ClientHttpRequestInterceptor {

    private final String clientId;
    private final String secret;

    /**
     * Create a new interceptor which adds a Basic authorization header
     * for the given client id/secret.
     * @param clientId the id to use
     * @param secret the secret to use
     */
    public CrimsonCardTokenAccessRequestAuthorizationInterceptor(String clientId, String secret) {
        Assert.hasLength(clientId, "clientId must not be empty");
        Assert.hasLength(secret, "secret must not be empty");
        this.clientId = clientId;
        this.secret = secret;
    }

    @Override
    public ClientHttpResponse intercept(HttpRequest request, byte[] body,
                                        ClientHttpRequestExecution execution) throws IOException {
        String combined = clientId + ":" + secret;
        String encoded = Base64Utils.encodeToString(combined.getBytes());
        request.getHeaders().add(HttpHeaders.AUTHORIZATION, "Basic " + encoded);
        return execution.execute(request, body);
    }
}
