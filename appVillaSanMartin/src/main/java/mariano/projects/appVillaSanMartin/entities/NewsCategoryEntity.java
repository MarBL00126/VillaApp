package mariano.projects.appVillaSanMartin.entities;
import jakarta.persistence.*;
import lombok.Data;
@Entity(name="NewsCategory")
@Table(name="news_categories")
@Data
public class NewsCategoryEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private String slug;
}
