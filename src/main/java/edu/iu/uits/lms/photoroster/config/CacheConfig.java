package edu.iu.uits.lms.photoroster.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.jcache.JCacheCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.cache.Caching;
import javax.cache.configuration.MutableConfiguration;
import javax.cache.expiry.AccessedExpiryPolicy;
import javax.cache.expiry.CreatedExpiryPolicy;
import javax.cache.expiry.Duration;
import javax.cache.spi.CachingProvider;
import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
@Slf4j
public class CacheConfig {
    String EHCACHE_PROVIDER_TYPE = "org.ehcache.jsr107.EhcacheCachingProvider";

    @Bean(name = "PhotorosterCacheManager")
    public CacheManager photorosterCacheManager() {
        log.debug("photorosterCacheManager() init");

        // Spring doesn't natively support ehcache 3.  It does ehcache 2.
        // But ehcache 3 IS JCache compliant (JSR-107 specification) and
        // therefore Spring does support that.

        // One has the option of using a JCache configuration (via a MutableConfiguration)
        // or a direct ehcache configuration. There also appears to be a way to
        // configure with a MutableConfiguration and then pull out a complete configuration
        // to do vendor specific things.  But just using the ehcache configuration from
        // the start seems to be the easiest setup to give us a simple ehcache.

        // Using an ehcache configuration allows one to use things (which we aren't currently
        // using but one day might) specific to ehcache.
        //
        // http://www.ehcache.org/documentation/3.0/107.html

        // NOTE: Typing the cache seems to cause exceptions to be thrown about needing
        // getCache() defined.  But setting them to generic Object.class seems to solve this.
        // There might be a way around this but that is work for a future ticket!

//        int heapSize = 1000;
        final int ttl = 3600;
        final int courseServiceTtl = 300;


        final MutableConfiguration<Object, Object> mutableLongConfiguration =
              new MutableConfiguration<Object, Object>()
                    .setTypes(Object.class, Object.class)
                    .setStoreByValue(false)
                    .setExpiryPolicyFactory(CreatedExpiryPolicy.factoryOf(new Duration(TimeUnit.SECONDS, ttl)))
                    .setManagementEnabled(true)
                    .setStatisticsEnabled(true);

        final MutableConfiguration<Object, Object> mutableMediumAccessedConfiguration =
              new MutableConfiguration<Object, Object>()
                    .setTypes(Object.class, Object.class)
                    .setStoreByValue(false)
                    .setExpiryPolicyFactory(AccessedExpiryPolicy.factoryOf(new Duration(TimeUnit.SECONDS, courseServiceTtl)))
                    .setManagementEnabled(true)
                    .setStatisticsEnabled(true);

        final CachingProvider provider = Caching.getCachingProvider(EHCACHE_PROVIDER_TYPE);

        final javax.cache.CacheManager cacheManager = provider.getCacheManager();

        createCacheIfMissing(cacheManager, "Photoroster.Course", mutableMediumAccessedConfiguration);
        createCacheIfMissing(cacheManager, "Photoroster.CourseSections", mutableMediumAccessedConfiguration);
        createCacheIfMissing(cacheManager, "Photoroster.CourseGroups", mutableMediumAccessedConfiguration);
        createCacheIfMissing(cacheManager, "Photoroster.CourseRoster", mutableMediumAccessedConfiguration);
        createCacheIfMissing(cacheManager, "Photoroster.FerpaMap", mutableMediumAccessedConfiguration);
        createCacheIfMissing(cacheManager, "Photoroster.Roles", mutableLongConfiguration);

        return new JCacheCacheManager(cacheManager);
    }

    private void createCacheIfMissing(javax.cache.CacheManager cacheManager, String cacheName, MutableConfiguration<Object, Object> cacheConfig) {
        if (cacheManager.getCache(cacheName, Object.class, Object.class) == null) {
            cacheManager.createCache(cacheName, cacheConfig);
        }
    }
}
