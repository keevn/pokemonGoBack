package comp354.team9;

import comp354.team9.service.FileStorageService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.Resource;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.junit4.SpringRunner;
import comp354.team9.model.*;
import comp354.team9.repository.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

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

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    AuthenticationManager authenticationManager;



    @Test
    public void newUserTest() {
        User user = new User("User3 Demo", "player3",
                "play3@pokemongoback.com", "password1");
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        Role userRole = roleRepository.findByName(RoleName.ROLE_USER).get();

        user.setRoles(Collections.singleton(userRole));

        UserDeck defaultDeck= userDeckRepository.getOne(new Long(3));

        user.setDefaultDeck(defaultDeck);
        
        User result = userRepository.save(user);

        assertThat(result.getUsername())
                .isEqualTo(user.getUsername());
        assertThat(result.getPassword())
                .isEqualTo(user.getPassword());


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

        int sizeBeforeAdd = found.getUserDecks().size();

        UserDeck deck = new UserDeck(found, "deck3", "25,3,16,1,25,4,5,6,6,14,25,26,25,25,7,20,8,10,25,9,3,9,11,7,26,26,12,25,26,8,14,12,13,2,1,26,25,25,26,26,17,19,15,2,20,26,17,20,18,18,26,26,22,23,24,11,21,13,21,49");

        deck = userDeckRepository.save(deck);
        
        found.setDefaultDeck(deck);

        User result = userRepository.saveAndFlush(found);

        assertThat(result.getDefaultDeck().getDeckName())
                .isEqualTo(deck.getDeckName());

        assertThat(result.getUserDecks().size()).isEqualTo(sizeBeforeAdd+1);
    }


    @Test
    public void userDeckListTest() {

        User user = userRepository.findByUsername("player1").get();

        List<UserDeck> decklist = userDeckRepository.findByUserId(user.getId());
        

        assertThat(user.getUserDecks().size())
                .isEqualTo(decklist.size());
    }

    @Test
    public void deckFileParseTest(){
        
        String cardlist = fileStorageService.processDeckFile("deck1.txt");

        String deck1CardList = "51,52,53,58,44,43,33,32,57,57,34,35,33,33,45,46,28,31,46,47,29,57,58,57,57,55,58,56,58,58,58,57,48,57,57,38,58,58,34,36,37,54,39,52,41,49,50,37,58,39,40,40,57,47,36,30,58,54,57,30";

        assertThat(cardlist)
                .isEqualTo(deck1CardList);

    }

    




}
