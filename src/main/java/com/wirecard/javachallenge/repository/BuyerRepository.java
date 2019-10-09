package com.wirecard.javachallenge.repository;
import com.wirecard.javachallenge.domain.Buyer;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Buyer entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BuyerRepository extends JpaRepository<Buyer, Long> {

}
