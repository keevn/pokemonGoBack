package comp354.team9.payload;

public class UserSummary {
    private Long id;
    private String username;
    private String name;
    private DeckInfo deck;

    public DeckInfo getDeck() {
        return deck;
    }

    public void setDeck(DeckInfo deck) {
        this.deck = deck;
    }

    public UserSummary(Long id, String username, String name , DeckInfo deck) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.deck =  deck;
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
}
