package mariano.projects.appVillaSanMartin.services;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;
import mariano.projects.appVillaSanMartin.entities.AppConfigEntity;
import mariano.projects.appVillaSanMartin.repositories.AppConfigRepository;

@Service 
@RequiredArgsConstructor 
public class ConfigService {
    private final AppConfigRepository appConfigRepository;
    public List<AppConfigEntity> getAll() {
        return appConfigRepository.findAll();
    }
    public String get(String key) {
        return findByKey(key).getValue();
    }
    public String get(String key, String defaultValue) {
        return appConfigRepository.findByKey(key)
                .map(AppConfigEntity::getValue)
                .orElse(defaultValue);
    }
    public boolean getBoolean(String key, boolean defaultValue) {
        return appConfigRepository.findByKey(key)
                .map(AppConfigEntity::getValue)
                .map(Boolean::parseBoolean)
                .orElse(defaultValue);
    }
    public int getInt(String key, int defaultValue) {
        return appConfigRepository.findByKey(key)
                .map(AppConfigEntity::getValue)
                .map(Integer::parseInt)
                .orElse(defaultValue);
    }
    public BigDecimal getNumber(String key, BigDecimal defaultValue) {
        return appConfigRepository.findByKey(key)
                .map(AppConfigEntity::getValue)
                .map(BigDecimal::new)
                .orElse(defaultValue);
    }
    public AppConfigEntity set(String key, String value) {
        AppConfigEntity config = appConfigRepository.findByKey(key)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Config key not found"));
        validateValue(config.getType(), value);
        config.setValue(value);
        return appConfigRepository.save(config);
    }
    public AppConfigEntity upsert(String key, String value, String type, String description) {
        AppConfigEntity config = appConfigRepository.findByKey(key).orElseGet(AppConfigEntity::new);
        config.setKey(key);
        config.setType(type != null ? type : "STRING");
        validateValue(config.getType(), value);
        config.setValue(value);
        config.setDescription(description);
        return appConfigRepository.save(config);
    }
    private AppConfigEntity findByKey(String key) {
        return appConfigRepository.findByKey(key)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Config key not found"));
    }
    private void validateValue(String type, String value) {
        if (value == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Config value is required");
        }
        switch (type) {
            case "BOOLEAN" -> {
                if (!"true".equalsIgnoreCase(value) && !"false".equalsIgnoreCase(value)) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Expected BOOLEAN value");
                }
            }
            case "NUMBER" -> {
                try {
                    new BigDecimal(value);
                } catch (NumberFormatException exception) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Expected NUMBER value");
                }
            }
            case "JSON" -> {
                String trimmed = value.trim();
                if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Expected JSON value");
                }
            }
            default -> {
                // STRING accepts any non-null value.
            }
        }
    }
}
