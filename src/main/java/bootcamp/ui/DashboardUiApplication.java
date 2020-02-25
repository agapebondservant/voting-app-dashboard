package bootcamp.ui;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Controller;

@SpringBootApplication
public class DashboardUiApplication {

	public static void main(String[] args) {
		SpringApplication.run(DashboardUiApplication.class, args);
	}

}

@Controller
class FrontEndController {
	public String main() {
		return "index";
	}
}