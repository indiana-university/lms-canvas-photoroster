package edu.iu.uits.lms.photoroster.crimsoncard.service;

import lombok.extern.slf4j.Slf4j;
import org.apache.http.NameValuePair;
import org.apache.http.client.utils.URLEncodedUtils;
import org.springframework.http.HttpHeaders;

import javax.ws.rs.core.Link;
import java.nio.charset.Charset;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
public class LinkHeaderParser {

    private static final String HEADER_LINK_NAME = "Link";
    private static final String LINK_DELIM = ",";

    private HttpHeaders headers;
    private Map<LINK_KEY, String> headerMap = new HashMap<>();

    private enum LINK_KEY {
        FIRST, PREV, NEXT, LAST;
    }

    public LinkHeaderParser(HttpHeaders headers) {
        this.headers = headers;
        parse();
    }

    private void parse() {
        String linkHeaderValue = headers.getFirst(HEADER_LINK_NAME);

        if(linkHeaderValue != null) {
            List<String> links = Arrays.asList(linkHeaderValue.split(LINK_DELIM));
            for (String linkVal : links) {
                String trimmedLink = linkVal.trim();
                if (!trimmedLink.isEmpty()) {
                    Link link = Link.valueOf(trimmedLink);
                    headerMap.put(LINK_KEY.valueOf(link.getRel().toUpperCase()), link.getUri().toString());
                }
            }
        }
    }

    public boolean hasLinkHeader() {
        return headerMap.size() > 0;
    }

    public String getFirst() {
        return headerMap.get(LINK_KEY.FIRST);
    }

    public String getNext() {
        return headerMap.get(LINK_KEY.NEXT);
    }

    public String getLast() {
        return headerMap.get(LINK_KEY.LAST);
    }

    public String getPrevious() {
        return headerMap.get(LINK_KEY.PREV);
    }

    public String debug(String currentUrl) {
        String lastLink = getLast();
        String lastPage = getPageForUrl(lastLink);
        String currentPage = getPageForUrl(currentUrl);
        return "Page " + currentPage + " of " + lastPage;
    }

    private String getPageForUrl(String url) {
        List<NameValuePair> queryParams = URLEncodedUtils.parse(url, Charset.defaultCharset());
        Map<String, String> paramMap = queryParams.stream()
                .collect(Collectors.toMap(NameValuePair::getName, NameValuePair::getValue));
        return paramMap.get("page");
    }
}

