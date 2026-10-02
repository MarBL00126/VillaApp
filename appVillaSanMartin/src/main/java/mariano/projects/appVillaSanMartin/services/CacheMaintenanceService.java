package mariano.projects.appVillaSanMartin.services;

import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

/** Invalida todas las cachés; lo usan los endpoints de administración, que escriben datos de cualquier dominio. */
@Service
public class CacheMaintenanceService {
    private final CacheManager cacheManager;

    public CacheMaintenanceService(CacheManager cacheManager) {
        this.cacheManager = cacheManager;
    }

    // Dentro de una transacción se limpia recién después del commit, para no repoblar la caché con datos viejos.
    public void evictAll() {
        if (TransactionSynchronizationManager.isSynchronizationActive()) {
            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override
                public void afterCommit() {
                    clearAll();
                }
            });
        } else {
            clearAll();
        }
    }

    private void clearAll() {
        for (String name : cacheManager.getCacheNames()) {
            Cache cache = cacheManager.getCache(name);
            if (cache != null) {
                cache.clear();
            }
        }
    }
}