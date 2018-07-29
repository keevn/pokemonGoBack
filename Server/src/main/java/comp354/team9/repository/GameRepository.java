package comp354.team9.repository;

import comp354.team9.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface GameRepository extends JpaRepository<User, Long> {
    Optional<User> findBygameName(String gameName);

    List<User> findByIdIn(List<Long> gameIds);
    Boolean existsBygameName(String gameName);

    Boolean existsBygameID(String gameID);
}