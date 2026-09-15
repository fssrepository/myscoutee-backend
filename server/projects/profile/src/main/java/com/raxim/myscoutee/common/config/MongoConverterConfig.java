package com.raxim.myscoutee.common.config;

import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.PriorityOrdered;
import org.springframework.data.mongodb.core.convert.MappingMongoConverter;

@Configuration
public class MongoConverterConfig {
    @Bean
    static DottedMapKeyPostProcessor preserveDottedMongoMapKeys() {
        return new DottedMapKeyPostProcessor();
    }

    // Register before ordinary post-processors can eagerly create Mongo repositories.
    static final class DottedMapKeyPostProcessor implements BeanPostProcessor, PriorityOrdered {
        @Override
        public int getOrder() {
            return Ordered.HIGHEST_PRECEDENCE;
        }

        @Override
        public Object postProcessBeforeInitialization(Object bean, String beanName) {
            if (bean instanceof MappingMongoConverter converter) {
                converter.preserveMapKeys(true);
            }
            return bean;
        }
    }
}
