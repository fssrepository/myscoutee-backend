package com.raxim.myscoutee.common.config;

import java.util.Locale;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.i18n.AcceptHeaderLocaleResolver;

import com.raxim.myscoutee.common.config.properties.AffinityRecomputeProperties;
import com.raxim.myscoutee.common.config.properties.AdminStatsProperties;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.common.config.properties.EmailProperties;
import com.raxim.myscoutee.common.config.properties.FirebaseProperties;
import com.raxim.myscoutee.common.config.properties.MediaStorageProperties;
import com.raxim.myscoutee.common.config.properties.OperatorConfigurationProperties;
import com.raxim.myscoutee.common.config.properties.OperatorUpdateProperties;
import com.raxim.myscoutee.common.config.properties.RegistryProperties;
import com.raxim.myscoutee.common.config.properties.RegistryDemoProperties;
import com.raxim.myscoutee.common.config.properties.RegionSecurityProperties;

@Configuration
@EnableConfigurationProperties({
        ConfigProperties.class,
        FirebaseProperties.class,
        EmailProperties.class,
        MediaStorageProperties.class,
        AdminStatsProperties.class,
        AffinityRecomputeProperties.class,
        RegionSecurityProperties.class,
        OperatorConfigurationProperties.class,
        OperatorUpdateProperties.class,
        RegistryProperties.class,
        RegistryDemoProperties.class
})
@EnableSpringDataWebSupport
@EnableScheduling
public class AppConfig {

    @Bean
    public LocaleResolver localeResolver() {
        AcceptHeaderLocaleResolver slr = new AcceptHeaderLocaleResolver();
        slr.setDefaultLocale(Locale.ENGLISH);
        return slr;
    }

    @Bean
    public MessageSource messageSource() {
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setBasenames(
                "classpath:i18n/messages");
        messageSource.setDefaultEncoding("UTF-8");
        return messageSource;
    }

    @Bean
    @Primary
    public LocalValidatorFactoryBean getValidator() {
        LocalValidatorFactoryBean bean = new LocalValidatorFactoryBean();
        bean.setValidationMessageSource(messageSource());
        bean.afterPropertiesSet();
        return bean;
    }
}
