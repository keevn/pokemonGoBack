package comp354.team9;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.junit4.SpringRunner;
import comp354.team9.model.*;
import comp354.team9.repository.*;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
public class PokemonGoBackTests {

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserDeckRepository userDeckRepository;

    @Autowired
    RoleRepository roleRepository;


    @Test
    public void newUserTest() {
        User user = new User("User1 Demo", "player1",
                "play1@pokemongoback.com", "password1");
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        Role userRole = roleRepository.findByName(RoleName.ROLE_USER).get();

        user.setRoles(Collections.singleton(userRole));

        User result = userRepository.save(user);

        assertThat(result.getUsername())
                .isEqualTo(user.getUsername());
    }

    @Test
    public void delUserTest() {
        User found = userRepository.findByUsername("player1").get();

        userRepository.delete(found);

        List<UserDeck> decklist = userDeckRepository.findByUserId(found.getId());

        assertThat(decklist.size())
                .isEqualTo(0);

    }

    @Test
    public void setDefaultDeckTest() {

        User found = userRepository.findByUsername("player1").get();

        UserDeck deck = new UserDeck(found, "deck1", "51,52,53,58,44,43,33,32,57,57,34,35,33,33,45,46,28,31,46,47,29,57,58,57,57,55,58,56,58,58,58,57,48,57,57,38,58,58,34,36,37,54,39,52,41,49,50,37,58,39,40,40,57,47,36,30,58,54,57,30");

        UserDeck deckResult = userDeckRepository.save(deck);

        found.setDefaultDeck(deckResult);

        User result = userRepository.save(found);

        assertThat(result.getDefaultDeck().getDeckName())
                .isEqualTo(deck.getDeckName());
    }


    @Test
    public void userDeckListTest() {

        User user = userRepository.findByUsername("player1").get();

        List<UserDeck> decklist = userDeckRepository.findByUserId(user.getId());

        user.getUserDecks();

        assertThat(user.getUserDecks().size())
                .isEqualTo(decklist.size());
    }


}
