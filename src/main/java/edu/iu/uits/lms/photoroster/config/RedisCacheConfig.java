package edu.iu.uits.lms.photoroster.config;

import edu.iu.uits.lms.photoroster.PhotorosterConstants;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;

import java.time.Duration;

@Profile("redis-cache")
@Configuration
@EnableCaching
@Slf4j
public class RedisCacheConfig {

    @Autowired
    private ToolConfig toolConfig;

    @Autowired
    private JedisConnectionFactory redisConnectionFactory;

    @Bean
    public RedisCacheConfiguration cacheConfiguration() {
        final int ttl = 300;
        return RedisCacheConfiguration.defaultCacheConfig()
              .entryTtl(Duration.ofSeconds(ttl))
              .disableCachingNullValues()
              .prefixCacheNameWith(toolConfig.getEnv() + "-photoroster");
    }

    @Bean
    public RedisCacheConfiguration cacheLongConfiguration() {
        final int ttl = 3600;
        return RedisCacheConfiguration.defaultCacheConfig()
              .entryTtl(Duration.ofSeconds(ttl))
              .disableCachingNullValues()
              .prefixCacheNameWith(toolConfig.getEnv() + "-photoroster");
    }

    @Bean(name = "PhotorosterCacheManager")
    public CacheManager cacheManager() {
        log.debug("cacheManager()");
        log.debug("Redis hostname: {}", redisConnectionFactory.getHostName());
        return RedisCacheManager.builder(redisConnectionFactory)
              .withCacheConfiguration(PhotorosterConstants.COURSE_CACHE, cacheConfiguration())
              .withCacheConfiguration(PhotorosterConstants.COURSESECTIONS_CACHE, cacheConfiguration())
              .withCacheConfiguration(PhotorosterConstants.COURSEGROUPS_CACHE, cacheConfiguration())
              .withCacheConfiguration(PhotorosterConstants.COURSEROSTER_CACHE, cacheConfiguration())
              .withCacheConfiguration(PhotorosterConstants.FERPA_CACHE, cacheConfiguration())
              .withCacheConfiguration(PhotorosterConstants.ROLES_CACHE, cacheLongConfiguration())
              .build();
    }
}
