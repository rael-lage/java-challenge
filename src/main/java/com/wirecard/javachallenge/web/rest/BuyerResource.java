package com.wirecard.javachallenge.web.rest;

import com.wirecard.javachallenge.domain.Buyer;
import com.wirecard.javachallenge.repository.BuyerRepository;
import com.wirecard.javachallenge.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.wirecard.javachallenge.domain.Buyer}.
 */
@RestController
@RequestMapping("/api")
public class BuyerResource {

    private final Logger log = LoggerFactory.getLogger(BuyerResource.class);

    private static final String ENTITY_NAME = "buyer";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BuyerRepository buyerRepository;

    public BuyerResource(BuyerRepository buyerRepository) {
        this.buyerRepository = buyerRepository;
    }

    /**
     * {@code POST  /buyers} : Create a new buyer.
     *
     * @param buyer the buyer to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new buyer, or with status {@code 400 (Bad Request)} if the buyer has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/buyers")
    public ResponseEntity<Buyer> createBuyer(@Valid @RequestBody Buyer buyer) throws URISyntaxException {
        log.debug("REST request to save Buyer : {}", buyer);
        if (buyer.getId() != null) {
            throw new BadRequestAlertException("A new buyer cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Buyer result = buyerRepository.save(buyer);
        return ResponseEntity.created(new URI("/api/buyers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /buyers} : Updates an existing buyer.
     *
     * @param buyer the buyer to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated buyer,
     * or with status {@code 400 (Bad Request)} if the buyer is not valid,
     * or with status {@code 500 (Internal Server Error)} if the buyer couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/buyers")
    public ResponseEntity<Buyer> updateBuyer(@Valid @RequestBody Buyer buyer) throws URISyntaxException {
        log.debug("REST request to update Buyer : {}", buyer);
        if (buyer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Buyer result = buyerRepository.save(buyer);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, buyer.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /buyers} : get all the buyers.
     *

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of buyers in body.
     */
    @GetMapping("/buyers")
    public List<Buyer> getAllBuyers() {
        log.debug("REST request to get all Buyers");
        return buyerRepository.findAll();
    }

    /**
     * {@code GET  /buyers/:id} : get the "id" buyer.
     *
     * @param id the id of the buyer to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the buyer, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/buyers/{id}")
    public ResponseEntity<Buyer> getBuyer(@PathVariable Long id) {
        log.debug("REST request to get Buyer : {}", id);
        Optional<Buyer> buyer = buyerRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(buyer);
    }

    /**
     * {@code DELETE  /buyers/:id} : delete the "id" buyer.
     *
     * @param id the id of the buyer to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/buyers/{id}")
    public ResponseEntity<Void> deleteBuyer(@PathVariable Long id) {
        log.debug("REST request to delete Buyer : {}", id);
        buyerRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
