package edu.iu.uits.lms.photoroster.crimsoncard.service;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.test.context.ContextConfiguration;

import javax.ws.rs.core.Link;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.List;

@ContextConfiguration
@Slf4j
public class LinkHeaderParserTest {

    @Test
    public void testFullHeader() {
        String first = "http://foo/?A=B&page=1&per_page=2";
        String prev = "http://foo/?A=B&page=1&per_page=2";
        String last = "http://foo/?A=B&page=7&per_page=2";
        String next = "http://foo/?A=B&page=7&per_page=2";

        HttpHeaders headers = headerBuilder(first, last, prev, next);

        LinkHeaderParser lhp = new LinkHeaderParser(headers);
        Assertions.assertEquals(first, lhp.getFirst());
        Assertions.assertEquals(prev, lhp.getPrevious());
        Assertions.assertEquals(last, lhp.getLast());
        Assertions.assertEquals(next, lhp.getNext());
        Assertions.assertEquals(true, lhp.hasLinkHeader());
    }

    @Test
    public void testPartialHeader() {
        String first = "http://foo/?A=B&page=1&per_page=2";
        String prev = "http://foo/?A=B&page=1&per_page=2";
        String last = null;
        String next = null;

        HttpHeaders headers = headerBuilder(first, last, prev, next);

        LinkHeaderParser lhp = new LinkHeaderParser(headers);
        Assertions.assertEquals(first, lhp.getFirst());
        Assertions.assertEquals(prev, lhp.getPrevious());
        Assertions.assertEquals(last, lhp.getLast());
        Assertions.assertEquals(next, lhp.getNext());
        Assertions.assertEquals(true, lhp.hasLinkHeader());
    }

    @Test
    public void testEmptyHeader() {
        String first = null;
        String prev = null;
        String last = null;
        String next = null;

        HttpHeaders headers = headerBuilder(null, null, null, null);

        LinkHeaderParser lhp = new LinkHeaderParser(headers);
        Assertions.assertEquals(first, lhp.getFirst());
        Assertions.assertEquals(prev, lhp.getPrevious());
        Assertions.assertEquals(last, lhp.getLast());
        Assertions.assertEquals(next, lhp.getNext());
        Assertions.assertEquals(false, lhp.hasLinkHeader());
    }

    @Test
    public void testNoLinkHeader() {
        String first = null;
        String prev = null;
        String last = null;
        String next = null;

        HttpHeaders headers = new HttpHeaders();

        LinkHeaderParser lhp = new LinkHeaderParser(headers);
        Assertions.assertEquals(first, lhp.getFirst());
        Assertions.assertEquals(prev, lhp.getPrevious());
        Assertions.assertEquals(last, lhp.getLast());
        Assertions.assertEquals(next, lhp.getNext());
        Assertions.assertEquals(false, lhp.hasLinkHeader());
    }

    @Test
    public void testCrazyHeader() {
        String first = "http://foo/?A=B&page=1&per_page=2&other=http://bar.com?asdf;qwerty";
        String prev = null;
        String last = null;
        String next = null;

        HttpHeaders headers = headerBuilder(first, last, prev, next);

        LinkHeaderParser lhp = new LinkHeaderParser(headers);
        Assertions.assertEquals(first, lhp.getFirst());
        Assertions.assertEquals(prev, lhp.getPrevious());
        Assertions.assertEquals(last, lhp.getLast());
        Assertions.assertEquals(next, lhp.getNext());
        Assertions.assertEquals(true, lhp.hasLinkHeader());
    }

    @Test
    public void testFoo() {
        Link link = Link.valueOf("<http://foo?A=B&page=1&per_page=2&other=http://bar.com?asdf;qwerty>; rel=\"first\"");
        log.debug("{}", link);
    }

    @Test
    public void testDebug() {
        String current = "http://foo/?A=B&page=7&per_page=2";
        String first = "http://foo/?A=B&page=1&per_page=2";
        String prev = null;
        String last = "http://foo/?A=B&page=100&per_page=2";;
        String next = null;

        HttpHeaders headers = headerBuilder(first, last, prev, next);

        LinkHeaderParser lhp = new LinkHeaderParser(headers);
        String text = lhp.debug(current);
        Assertions.assertEquals("Page 7 of 100", text);
    }


    private HttpHeaders headerBuilder(String first, String last, String previous, String next) {
        List<String> headerList = new ArrayList<>();
        String format = "<{0}>; rel=\"{1}\"";

        if (first != null) {
            headerList.add(MessageFormat.format(format, first, "first"));
        }
        if (last != null) {
            headerList.add(MessageFormat.format(format, last, "last"));
        }
        if (previous != null) {
            headerList.add(MessageFormat.format(format, previous, "prev"));
        }
        if (next != null) {
            headerList.add(MessageFormat.format(format, next, "next"));
        }

        HttpHeaders headers = new HttpHeaders();
        headers.add("Link", StringUtils.join(headerList, ", "));

        return headers;
    }

    @Configuration
    static class LinkHeaderParserTestContextConfiguration {

    }
}
