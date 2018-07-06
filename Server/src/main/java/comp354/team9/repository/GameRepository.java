package comp354.team9.repository;

import comp354.team9.model.Game;

import comp354.team9.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameRepository extends JpaRepository<Game, Long>{


    Optional<User> findByI(String name, Long id);

    List<User> findAllById(List<Long> userIds);




}
