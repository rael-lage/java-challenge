package com.wirecard.javachallenge.repository;
import com.wirecard.javachallenge.domain.Boleto;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Boleto entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BoletoRepository extends JpaRepository<Boleto, Long> {

}
