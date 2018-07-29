package comp354.team9.model;

import comp354.team9.model.audit.DateAudit;
import org.hibernate.annotations.Proxy;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Proxy(lazy = false)
@Table(name = "game")
public class Game extends DateAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long gameId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Game game;

    @NotBlank
    @Size(max = 40)
    private String gameName;

    @NotBlank
    @Size(max = 200)
    private String status;

    public Game(Game game, @NotBlank @Size(max = 40) String gameName, @NotBlank @Size(max = 200) String status) {
        this.game = game;
        this.gameName = gameName;
        this.status = status;
    }

    public Long getGameId() {
        return gameId;
    }

    public void setGameId(Long gameId) {
        this.gameId = gameId;
    }

    public Game getGame() {
        return game;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    public String getGameName() {
        return gameName;
    }

    public void setGameName(String gameName) {
        this.gameName = gameName;
    }

    public String getContent() {
        return status;
    }

    public void setContent(String content) {
        this.status = status;
    }
}
