package mariano.projects.appVillaSanMartin.entities;
import jakarta.persistence.*;
import lombok.Data;
@Entity(name="Photo")
@Table(name="photos")
@Data
public class PhotoEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne @JoinColumn(name="gallery_id")
    private GalleryEntity gallery;
    private String imageUrl;
    private String caption;
    private Integer sortOrder;
}
