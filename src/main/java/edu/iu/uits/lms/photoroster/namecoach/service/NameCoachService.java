package edu.iu.uits.lms.photoroster.namecoach.service;

/*-
 * #%L
 * photoroster
 * %%
 * Copyright (C) 2015 - 2022 Indiana University
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

import com.fasterxml.jackson.annotation.JsonProperty;
import edu.iu.uits.lms.photoroster.namecoach.config.NameCoachServicesConfig;
import edu.iu.uits.lms.photoroster.namecoach.model.Meta;
import edu.iu.uits.lms.photoroster.namecoach.model.PagedParticipants;
import edu.iu.uits.lms.photoroster.namecoach.model.Participant;
import edu.iu.uits.lms.photoroster.namecoach.model.Participants;
import edu.iu.uits.lms.photoroster.namecoach.model.WrappedParticipant;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.mutable.MutableBoolean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.util.UriTemplate;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Slf4j
@Service
/**
 * API documentation available <a href="https://name-coach.com/connect" target="_blank" rel="noopener noreferrer">here</a>
 */
public class NameCoachService {
    private static final String BASE_URI = "{url}";
    private static final String PARTICIPANT_BASE_URI = BASE_URI + "/participants";
    private static final String PARTICIPANT_TEMPLATE_URI = PARTICIPANT_BASE_URI + "/{id_or_email}";
    private static final String PARTICIPANT_SEARCH_TEMPLATE_URI = PARTICIPANT_BASE_URI + "/search";

    private static final UriTemplate PARTICIPANT_TEMPLATE = new UriTemplate(PARTICIPANT_TEMPLATE_URI);
    private static final UriTemplate PARTICIPANT_SEARCH_TEMPLATE = new UriTemplate(PARTICIPANT_SEARCH_TEMPLATE_URI);

    private static final String PAGE_SIZE = "2000";

    public static final String INCLUDE_CUSTOM_ATTRIBUTES = "custom_attributes";
    public static final String INCLUDE_EMBEDDABLES = "embeddables";


    @Autowired
    @Qualifier("ncRestTemplate")
    private RestTemplate ncRestTemplate;

    @Autowired
    private NameCoachServicesConfig config;


    public Participant getParticipant(String email) {
        URI uri = PARTICIPANT_TEMPLATE.expand(config.getUrl(), email);
        UriComponentsBuilder builder = UriComponentsBuilder.fromUri(uri);
        builder.queryParam("include", INCLUDE_CUSTOM_ATTRIBUTES);

        WrappedParticipant participant = null;
        try {
            participant = ncRestTemplate.getForObject(builder.build().toUri(), WrappedParticipant.class);
        } catch (HttpStatusCodeException e) {
            log.warn("Unable to lookup namecoach data for " + email, e);
        }

        return participant.getParticipant();
    }

    public Participants getParticipants(List<String> emails, boolean singleEntryPerParticipant) {
        List<Participant> participants = Collections.emptyList();
        log.debug("Making namecoach request with " + emails.size() + " emails.");
        MutableBoolean hasErrors = new MutableBoolean(false);

        //An empty email list means ALL records are returned.  Which is a lot.  And we probably don't want that!
        if (!emails.isEmpty()) {
            String emailString = String.join(",", emails);
            URI uri = PARTICIPANT_SEARCH_TEMPLATE.expand(config.getUrl());

            SearchCriteria searchCriteria = new SearchCriteria(PAGE_SIZE, emailString, INCLUDE_CUSTOM_ATTRIBUTES);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<SearchCriteria> requestEntity = new HttpEntity<>(searchCriteria, headers);

            try {
                participants = pagedExchange(ncRestTemplate, uri.toString(), requestEntity, hasErrors);
            } catch (HttpStatusCodeException e) {
                log.warn("Unable to lookup namecoach data for " + emailString, e);
            }

            if (singleEntryPerParticipant && participants != null) {
                //Filter out the "duplicates"
                List<Participant> uniques = participants.stream()
                      .filter(distinctByKey(Participant::getEmail))
                      .collect(Collectors.toList());
                return new Participants(uniques, hasErrors.booleanValue());
            }
        }

        return new Participants(participants, hasErrors.booleanValue());
    }

    /**
     * Build a predicate using a specific key from the data
     * @param keyExtractor
     * @param <T>
     * @return
     */
    private static <T> Predicate<T> distinctByKey(Function<? super T, ?> keyExtractor) {
        Set<Object> seen = ConcurrentHashMap.newKeySet();
        return t -> seen.add(keyExtractor.apply(t));
    }

    /**
     * Do a GET request, paginating through the entire dataset
     * @param restTemplate
     * @param url
     * @return
     */
    private List<Participant> pagedExchange(RestTemplate restTemplate, String url, HttpEntity requestEntity, MutableBoolean hasErrors) {
        List<Participant> resultList = new ArrayList<>();
        try {
            ResponseEntity<PagedParticipants> entity = restTemplate.exchange(url, HttpMethod.POST, requestEntity, PagedParticipants.class);

            Meta meta = entity.getBody().getMeta();
            resultList.addAll(entity.getBody().getParticipants());
            String nextLink = meta.getNextPageUrl();
            if (nextLink != null) {
                resultList.addAll(pagedExchange(restTemplate, URLDecoder.decode(nextLink, StandardCharsets.UTF_8.name()), requestEntity, hasErrors));
                log.debug("Fetched results " + resultList.size() + " of " + meta.getTotalCount());
            }
        } catch (HttpStatusCodeException e) {
            log.debug("URI: {}", url);
            log.error("Error getting namecoach data: " + e.getResponseBodyAsString(), e);
            hasErrors.setValue(true);
        } catch (Exception e) {
            log.debug("URI: {}", url);
            log.error("Something unexpected happened with the namecoach call", e);
            hasErrors.setValue(true);
        }
        return resultList;
    }

    @Data
    @AllArgsConstructor
    private static class SearchCriteria {

        @JsonProperty("per_page")
        private String perPage;

        @JsonProperty("email_list")
        private String emailList;

        /**
         * A comma separated set of resources to include in the response. Options are
         * {@link #INCLUDE_CUSTOM_ATTRIBUTES} (this includes gender pronouns) and {@link #INCLUDE_EMBEDDABLES}
         */
        @JsonProperty("include")
        private String includeOptions;
    }



}
