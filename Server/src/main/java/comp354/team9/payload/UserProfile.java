package comp354.team9.payload;

import comp354.team9.model.User;

import java.time.Instant;

public class UserProfile {
    private Long id;
    private String username;
    private String name;
    private Instant joinedAt;
    private DeckInfo deck;

    public UserProfile(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.name = user.getName();
        this.joinedAt = user.getCreatedAt();
        this.deck = new DeckInfo(user.getDefaultDeck());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Instant getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(Instant joinedAt) {
        this.joinedAt = joinedAt;
    }


    public DeckInfo getDeck() {
        return deck;
    }

    public void setDeck(DeckInfo deck) {
        this.deck = deck;
    }
}