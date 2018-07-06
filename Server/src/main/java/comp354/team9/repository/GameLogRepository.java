package comp354.team9.repository;

import comp354.team9.model.GameLog;

import comp354.team9.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

public interface GameLogRepository extends JpaRepository<GameLog,Long> {


    Optional<User> findByI(String name, Long id);

    List<User> findAllById(List<Long> userIds);
}
