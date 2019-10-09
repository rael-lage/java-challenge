package com.wirecard.javachallenge.web.rest;

import com.wirecard.javachallenge.domain.Boleto;
import com.wirecard.javachallenge.repository.BoletoRepository;
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
 * REST controller for managing {@link com.wirecard.javachallenge.domain.Boleto}.
 */
@RestController
@RequestMapping("/api")
public class BoletoResource {

    private final Logger log = LoggerFactory.getLogger(BoletoResource.class);

    private static final String ENTITY_NAME = "boleto";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BoletoRepository boletoRepository;

    public BoletoResource(BoletoRepository boletoRepository) {
        this.boletoRepository = boletoRepository;
    }

    /**
     * {@code POST  /boletos} : Create a new boleto.
     *
     * @param boleto the boleto to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new boleto, or with status {@code 400 (Bad Request)} if the boleto has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/boletos")
    public ResponseEntity<Boleto> createBoleto(@Valid @RequestBody Boleto boleto) throws URISyntaxException {
        log.debug("REST request to save Boleto : {}", boleto);
        if (boleto.getId() != null) {
            throw new BadRequestAlertException("A new boleto cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Boleto result = boletoRepository.save(boleto);
        return ResponseEntity.created(new URI("/api/boletos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /boletos} : Updates an existing boleto.
     *
     * @param boleto the boleto to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated boleto,
     * or with status {@code 400 (Bad Request)} if the boleto is not valid,
     * or with status {@code 500 (Internal Server Error)} if the boleto couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/boletos")
    public ResponseEntity<Boleto> updateBoleto(@Valid @RequestBody Boleto boleto) throws URISyntaxException {
        log.debug("REST request to update Boleto : {}", boleto);
        if (boleto.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Boleto result = boletoRepository.save(boleto);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, boleto.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /boletos} : get all the boletos.
     *

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of boletos in body.
     */
    @GetMapping("/boletos")
    public List<Boleto> getAllBoletos() {
        log.debug("REST request to get all Boletos");
        return boletoRepository.findAll();
    }

    /**
     * {@code GET  /boletos/:id} : get the "id" boleto.
     *
     * @param id the id of the boleto to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the boleto, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/boletos/{id}")
    public ResponseEntity<Boleto> getBoleto(@PathVariable Long id) {
        log.debug("REST request to get Boleto : {}", id);
        Optional<Boleto> boleto = boletoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(boleto);
    }

    /**
     * {@code DELETE  /boletos/:id} : delete the "id" boleto.
     *
     * @param id the id of the boleto to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/boletos/{id}")
    public ResponseEntity<Void> deleteBoleto(@PathVariable Long id) {
        log.debug("REST request to delete Boleto : {}", id);
        boletoRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
