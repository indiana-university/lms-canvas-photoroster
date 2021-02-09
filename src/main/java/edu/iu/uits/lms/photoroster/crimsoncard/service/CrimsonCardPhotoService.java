package edu.iu.uits.lms.photoroster.crimsoncard.service;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import edu.iu.uits.lms.photoroster.crimsoncard.config.CrimsonCardServicesConfig;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
public class CrimsonCardPhotoService {

    @Autowired
    @Qualifier("ccRestTemplate")
    private OAuth2RestTemplate ccRestTemplate;

    @Autowired
    private CrimsonCardServicesConfig config;

    public static class CCAttributes {
        @AllArgsConstructor
        @Getter
        public enum ID_TYPE {
            NETWORK_ID("NetworkID"),
            PATRON_ID("PatronID"),
            UNIVERSITY_ID("UniversityID");

            private String value;
        }

        @AllArgsConstructor
        @Getter
        public enum SIZE {
            ORIGINAL("Original"),
            S64X64("S64x64"),
            S75X100("S75x100"),
            S240X320("S240x320"),
            S480X640("S480x640");

            private String value;
        }
    }

    public Map<String, String> getImageUrls(List<String> userIds, CCAttributes.ID_TYPE idType, CCAttributes.SIZE size) {
        Map<String, String> imageMap = new HashMap<>();

        if (!userIds.isEmpty()) {
            List<CCId> ids = userIds.stream().distinct()
                    .map(CCId::new)
                    .collect(Collectors.toList());

            if (log.isDebugEnabled()) {
                GsonBuilder builder = new GsonBuilder();
                Gson gson = builder.create();
                String json = gson.toJson(ids);
                log.debug(json);
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            String url = "{base_url}/api/v1/patron/photo/urls";

            UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(url)
                    .queryParam("Hostname", config.getLmsHost())
                    .queryParam("PhotoSize", size.getValue())
//                    .queryParam("page", 1)
                    .queryParam("per_page", 100)
                    .queryParam("IDType", idType.getValue());
            String uriBuilder = builder.buildAndExpand(config.getBaseUrl()).toUriString();

            HttpEntity<List<CCId>> requestEntity = new HttpEntity<>(ids, headers);

            ParameterizedTypeReference<List<CCImageResponse>> listOfThings = new ParameterizedTypeReference<List<CCImageResponse>>() {
            };

            List<CCImageResponse> imageList = pagedExchange(ccRestTemplate, uriBuilder, HttpMethod.POST, requestEntity, listOfThings);

            //CrimsonCard was returning multiple results for a single user, so we want to filter them out by adding "distinct()"
            imageMap = imageList.stream().distinct().collect(Collectors.toMap(
                    CCImageResponse::getId, CCImageResponse::getPhotoUrl));
        }
        return imageMap;
    }

    public byte[] getImage(String userId, CCAttributes.SIZE size) {
        byte[] image = null;

        try {
            image = ccRestTemplate.getForObject("{base_url}/api/v1/patron/image/{userId}/{size}",
                  byte[].class,
                  config.getBaseUrl(), userId, size.name());
            log.debug("{}", image);
        } catch (HttpStatusCodeException e) {
            log.warn("Unable to lookup user image for " + userId);
        }

        if (image == null) {
            image = DefaultImageUtil.getDefaultImage(size);
        }

        return image;
    }

    /**
     * Do a POST request, paginating through the entire dataset
     * @param restTemplate
     * @param url
     * @param method
     * @param requestEntity
     * @param responseType
     * @return
     */
    private List<CCImageResponse> pagedExchange(RestTemplate restTemplate, String url, HttpMethod method, HttpEntity requestEntity, ParameterizedTypeReference<List<CCImageResponse>> responseType) {
        List<CCImageResponse> resultList = new ArrayList<>();
        try {
            ResponseEntity<List<CCImageResponse>> entity = restTemplate.exchange(url, method, requestEntity, responseType);

            LinkHeaderParser lhp = new LinkHeaderParser(entity.getHeaders());
            resultList.addAll(entity.getBody());
            if (lhp.hasLinkHeader()) {
                String nextLink = lhp.getNext();
                if (nextLink != null) {
                    log.debug(lhp.debug(url) + " - " + resultList.size());
                    resultList.addAll(pagedExchange(restTemplate, nextLink, method, requestEntity, responseType));
                }
            }
        } catch (HttpStatusCodeException e) {
            log.error("Error getting photo urls: " + e.getResponseBodyAsString(), e);
        } catch (Exception e) {
            log.error("Error getting photo urls", e);
        }
        return resultList;
    }

    @Data
    @AllArgsConstructor
    private static class CCId {
        private String id;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @EqualsAndHashCode(exclude = "photoUrl")
    /**
     * Exclude the PhotoUrl attribute from the equals/hashcode so that we can ignore "duplicates"
     */
    protected static class CCImageResponse {
        @JsonProperty("Id")
        private String id;

        @JsonProperty("PhotoUrl")
        private String photoUrl;
    }
}
