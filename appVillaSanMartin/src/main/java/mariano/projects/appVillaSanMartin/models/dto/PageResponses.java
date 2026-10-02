package mariano.projects.appVillaSanMartin.models.dto;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

/** Paginación compatible con el frontend: el cuerpo sigue siendo un array y el total viaja en X-Total-Count. */
public final class PageResponses {

    public static final int DEFAULT_SIZE = 20;
    public static final int MAX_SIZE = 100;
    public static final String TOTAL_HEADER = "X-Total-Count";

    private PageResponses() {
    }

    public static Pageable pageable(int page, int size) {
        int safePage = Math.max(0, page);
        int safeSize = size < 1 ? DEFAULT_SIZE : Math.min(size, MAX_SIZE);
        return PageRequest.of(safePage, safeSize);
    }

    public static <T> ResponseEntity<List<T>> of(Page<T> page) {
        return ResponseEntity.ok()
                .header(TOTAL_HEADER, String.valueOf(page.getTotalElements()))
                .body(page.getContent());
    }
}
