package comp354.team9.model;


import org.hibernate.annotations.NaturalId;
import javax.persistence.*;

@Entity
@Table(name = "roles")

public class GameLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public GameLog() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
