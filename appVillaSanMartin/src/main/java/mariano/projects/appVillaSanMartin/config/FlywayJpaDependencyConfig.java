package mariano.projects.appVillaSanMartin.config;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Hace que entityManagerFactory dependa del bean "flyway",
 * garantizando que las migraciones corren antes de que Hibernate
 * intente usar las tablas.
 */
@Configuration
public class FlywayJpaDependencyConfig {

    @Bean
    public static BeanFactoryPostProcessor flywayEntityManagerFactoryDependsOn() {
        return new BeanFactoryPostProcessor() {
            @Override
            public void postProcessBeanFactory(ConfigurableListableBeanFactory factory)
                    throws BeansException {
                String[] emfBeans = factory.getBeanNamesForType(
                        jakarta.persistence.EntityManagerFactory.class, true, false);
                for (String beanName : emfBeans) {
                    BeanDefinition bd = factory.getBeanDefinition(beanName);
                    String[] existing = bd.getDependsOn();
                    String[] updated;
                    if (existing == null) {
                        updated = new String[] { "flyway" };
                    } else {
                        updated = new String[existing.length + 1];
                        System.arraycopy(existing, 0, updated, 0, existing.length);
                        updated[existing.length] = "flyway";
                    }
                    bd.setDependsOn(updated);
                }
            }
        };
    }
}