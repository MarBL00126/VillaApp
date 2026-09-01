package mariano.projects.appVillaSanMartin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AppVillaSanMartinApplication {

	public static void main(String[] args) {
		SpringApplication.run(AppVillaSanMartinApplication.class, args);
		System.out.println("TIC TAC FUNCIONA");
	}

}
