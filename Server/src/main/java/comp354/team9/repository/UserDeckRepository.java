package comp354.team9.repository;

import comp354.team9.model.User;
import comp354.team9.model.UserDeck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface UserDeckRepository extends JpaRepository<UserDeck, Long> {

    List<UserDeck> findByIdIn(List<Long> deckIds);

    List<UserDeck> findByUserName(String userName);

    List<UserDeck> findByUserId(Long userId);
}
