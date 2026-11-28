
package lk.medichannel.room.repository;

import lk.medichannel.room.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    List<Room> findByActiveTrue();

    List<Room> findByActive(boolean active);

    boolean existsByRoomName(String roomName);
}

