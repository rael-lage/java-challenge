package com.wirecard.javachallenge.web.rest;

import com.wirecard.javachallenge.JavaChallengeApp;
import com.wirecard.javachallenge.domain.Boleto;
import com.wirecard.javachallenge.repository.BoletoRepository;
import com.wirecard.javachallenge.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.List;

import static com.wirecard.javachallenge.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link BoletoResource} REST controller.
 */
@SpringBootTest(classes = JavaChallengeApp.class)
public class BoletoResourceIT {

    private static final Long DEFAULT_NUMBER = 1L;
    private static final Long UPDATED_NUMBER = 2L;
    private static final Long SMALLER_NUMBER = 1L - 1L;

    @Autowired
    private BoletoRepository boletoRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restBoletoMockMvc;

    private Boleto boleto;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final BoletoResource boletoResource = new BoletoResource(boletoRepository);
        this.restBoletoMockMvc = MockMvcBuilders.standaloneSetup(boletoResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Boleto createEntity(EntityManager em) {
        Boleto boleto = new Boleto()
            .number(DEFAULT_NUMBER);
        return boleto;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Boleto createUpdatedEntity(EntityManager em) {
        Boleto boleto = new Boleto()
            .number(UPDATED_NUMBER);
        return boleto;
    }

    @BeforeEach
    public void initTest() {
        boleto = createEntity(em);
    }

    @Test
    @Transactional
    public void createBoleto() throws Exception {
        int databaseSizeBeforeCreate = boletoRepository.findAll().size();

        // Create the Boleto
        restBoletoMockMvc.perform(post("/api/boletos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(boleto)))
            .andExpect(status().isCreated());

        // Validate the Boleto in the database
        List<Boleto> boletoList = boletoRepository.findAll();
        assertThat(boletoList).hasSize(databaseSizeBeforeCreate + 1);
        Boleto testBoleto = boletoList.get(boletoList.size() - 1);
        assertThat(testBoleto.getNumber()).isEqualTo(DEFAULT_NUMBER);
    }

    @Test
    @Transactional
    public void createBoletoWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = boletoRepository.findAll().size();

        // Create the Boleto with an existing ID
        boleto.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restBoletoMockMvc.perform(post("/api/boletos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(boleto)))
            .andExpect(status().isBadRequest());

        // Validate the Boleto in the database
        List<Boleto> boletoList = boletoRepository.findAll();
        assertThat(boletoList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkNumberIsRequired() throws Exception {
        int databaseSizeBeforeTest = boletoRepository.findAll().size();
        // set the field null
        boleto.setNumber(null);

        // Create the Boleto, which fails.

        restBoletoMockMvc.perform(post("/api/boletos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(boleto)))
            .andExpect(status().isBadRequest());

        List<Boleto> boletoList = boletoRepository.findAll();
        assertThat(boletoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllBoletos() throws Exception {
        // Initialize the database
        boletoRepository.saveAndFlush(boleto);

        // Get all the boletoList
        restBoletoMockMvc.perform(get("/api/boletos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(boleto.getId().intValue())))
            .andExpect(jsonPath("$.[*].number").value(hasItem(DEFAULT_NUMBER.intValue())));
    }
    
    @Test
    @Transactional
    public void getBoleto() throws Exception {
        // Initialize the database
        boletoRepository.saveAndFlush(boleto);

        // Get the boleto
        restBoletoMockMvc.perform(get("/api/boletos/{id}", boleto.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(boleto.getId().intValue()))
            .andExpect(jsonPath("$.number").value(DEFAULT_NUMBER.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingBoleto() throws Exception {
        // Get the boleto
        restBoletoMockMvc.perform(get("/api/boletos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateBoleto() throws Exception {
        // Initialize the database
        boletoRepository.saveAndFlush(boleto);

        int databaseSizeBeforeUpdate = boletoRepository.findAll().size();

        // Update the boleto
        Boleto updatedBoleto = boletoRepository.findById(boleto.getId()).get();
        // Disconnect from session so that the updates on updatedBoleto are not directly saved in db
        em.detach(updatedBoleto);
        updatedBoleto
            .number(UPDATED_NUMBER);

        restBoletoMockMvc.perform(put("/api/boletos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedBoleto)))
            .andExpect(status().isOk());

        // Validate the Boleto in the database
        List<Boleto> boletoList = boletoRepository.findAll();
        assertThat(boletoList).hasSize(databaseSizeBeforeUpdate);
        Boleto testBoleto = boletoList.get(boletoList.size() - 1);
        assertThat(testBoleto.getNumber()).isEqualTo(UPDATED_NUMBER);
    }

    @Test
    @Transactional
    public void updateNonExistingBoleto() throws Exception {
        int databaseSizeBeforeUpdate = boletoRepository.findAll().size();

        // Create the Boleto

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBoletoMockMvc.perform(put("/api/boletos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(boleto)))
            .andExpect(status().isBadRequest());

        // Validate the Boleto in the database
        List<Boleto> boletoList = boletoRepository.findAll();
        assertThat(boletoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteBoleto() throws Exception {
        // Initialize the database
        boletoRepository.saveAndFlush(boleto);

        int databaseSizeBeforeDelete = boletoRepository.findAll().size();

        // Delete the boleto
        restBoletoMockMvc.perform(delete("/api/boletos/{id}", boleto.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Boleto> boletoList = boletoRepository.findAll();
        assertThat(boletoList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Boleto.class);
        Boleto boleto1 = new Boleto();
        boleto1.setId(1L);
        Boleto boleto2 = new Boleto();
        boleto2.setId(boleto1.getId());
        assertThat(boleto1).isEqualTo(boleto2);
        boleto2.setId(2L);
        assertThat(boleto1).isNotEqualTo(boleto2);
        boleto1.setId(null);
        assertThat(boleto1).isNotEqualTo(boleto2);
    }
}
