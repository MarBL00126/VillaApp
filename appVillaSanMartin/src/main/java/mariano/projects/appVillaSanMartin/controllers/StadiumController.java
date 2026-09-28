package mariano.projects.appVillaSanMartin.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import mariano.projects.appVillaSanMartin.models.responses.StadiumInfoResponse;
import mariano.projects.appVillaSanMartin.models.responses.StadiumSectorResponse;
import mariano.projects.appVillaSanMartin.models.responses.StadiumServiceResponse;
import mariano.projects.appVillaSanMartin.services.StadiumService;

@RestController 
@RequestMapping ("/api/stadiums")
@RequiredArgsConstructor 
public class StadiumController {
    private final StadiumService stadiumService;
    @GetMapping 
    public StadiumInfoResponse getInfo(){
        return stadiumService.getInfo();
    }
    @GetMapping("/sectors")
    public List<StadiumSectorResponse> getSectors(){
        return stadiumService.getSectors();
    }
    @GetMapping("/services")
    public List<StadiumServiceResponse> getSectors(@RequestParam(required = false) String type){
        return stadiumService.getServices(type);
    }
}
