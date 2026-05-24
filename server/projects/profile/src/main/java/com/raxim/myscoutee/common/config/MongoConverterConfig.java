package com.raxim.myscoutee.common.config;

import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.convert.MappingMongoConverter;

@Configuration
public class MongoConverterConfig {
    @Bean
    static BeanPostProcessor preserveDottedMongoMapKeys() {
        return new BeanPostProcessor() {
            @Override
            public Object postProcessBeforeInitialization(Object bean, String beanName) {
                if (bean instanceof MappingMongoConverter converter) {
                    converter.preserveMapKeys(true);
                }
                return bean;
            }
        };
    }
}
