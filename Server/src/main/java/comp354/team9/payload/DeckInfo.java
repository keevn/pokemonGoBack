package comp354.team9.payload;

import comp354.team9.model.UserDeck;
import comp354.team9.util.Utility;

public class DeckInfo {

    private String deckName;

    private int[] cardList;

    private Long deckId;

    public DeckInfo() {

    }

    public DeckInfo(UserDeck deck) {
        this.deckName = deck.getDeckName();
        this.cardList = Utility.covertStringToArray(deck.getContent());
        this.deckId = deck.getId();
    }

    public String getDeckName() {
        return deckName;
    }

    public void setDeckName(String deckName) {
        this.deckName = deckName;
    }

    public int[] getCardList() {
        return cardList;
    }

    public void setCardList(int[] cardList) {
        this.cardList = cardList;
    }

    public Long getDeckId() {
        return deckId;
    }

    public void setDeckId(Long deckId) {
        this.deckId = deckId;
    }
}
