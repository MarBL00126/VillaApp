package mariano.projects.appVillaSanMartin.services;
import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import mariano.projects.appVillaSanMartin.entities.StadiumInfoEntity;
import mariano.projects.appVillaSanMartin.entities.StadiumServiceEntity;
import mariano.projects.appVillaSanMartin.models.responses.StadiumInfoResponse;
import mariano.projects.appVillaSanMartin.models.responses.StadiumSectorResponse;
import mariano.projects.appVillaSanMartin.models.responses.StadiumServiceResponse;
import mariano.projects.appVillaSanMartin.repositories.StadiumInfoRepository;
import mariano.projects.appVillaSanMartin.repositories.StadiumSectorRepository;
import mariano.projects.appVillaSanMartin.repositories.StadiumServiceRepository;

@Service 
@RequiredArgsConstructor 
public class StadiumService {
    private final StadiumInfoRepository stadiumInfoRepository;
    private final StadiumSectorRepository stadiumSectorRepository;
    private final StadiumServiceRepository stadiumServiceRepository;
    public StadiumInfoResponse getInfo(){
        StadiumInfoEntity stadium=stadiumInfoRepository.findAll()
        .stream()
        .findFirst()
        .orElseThrow(() -> new RuntimeException("Información del estadio no encontrada"));
        return new StadiumInfoResponse(
            stadium.getId(),
            stadium.getName(),
            stadium.getAddress(),
            stadium.getCity(),
            stadium.getCapacity(),
            stadium.getMapUrl(),
            stadium.getParkingUrl(),
            stadium.getLatitude(),
            stadium.getLongitude()
        );
    }
    public List<StadiumSectorResponse> getSectors() {
        return stadiumSectorRepository.findByActiveTrue()
        .stream()
        .map(sector->new StadiumSectorResponse(
            sector.getId(),
                        sector.getName(),
                        sector.getType(),
                        sector.getGate(),
                        sector.getCapacity(),
                        sector.getColorHex(),
                        sector.getDescription()
        ))
        .toList();
    }
    public List<StadiumServiceResponse> getServices(String type) {
        List<StadiumServiceEntity> services;
        if (type != null && !type.isBlank()) {
            services = stadiumServiceRepository.findByTypeAndActiveTrue(type);
        } else {
            services = stadiumServiceRepository.findByActiveTrue();
        }
        return services.stream()
        .map(service -> new StadiumServiceResponse(
                        service.getId(),
                        service.getType(),
                        service.getName(),
                        service.getLocation(),
                        service.getSector() != null
                                ? service.getSector().getId()
                                : null
                ))
        .toList();
    }

}
