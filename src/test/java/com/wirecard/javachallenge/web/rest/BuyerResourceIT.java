package com.wirecard.javachallenge.web.rest;

import com.wirecard.javachallenge.JavaChallengeApp;
import com.wirecard.javachallenge.domain.Buyer;
import com.wirecard.javachallenge.repository.BuyerRepository;
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
 * Integration tests for the {@link BuyerResource} REST controller.
 */
@SpringBootTest(classes = JavaChallengeApp.class)
public class BuyerResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final Long DEFAULT_CPF = 1L;
    private static final Long UPDATED_CPF = 2L;
    private static final Long SMALLER_CPF = 1L - 1L;

    @Autowired
    private BuyerRepository buyerRepository;

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

    private MockMvc restBuyerMockMvc;

    private Buyer buyer;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final BuyerResource buyerResource = new BuyerResource(buyerRepository);
        this.restBuyerMockMvc = MockMvcBuilders.standaloneSetup(buyerResource)
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
    public static Buyer createEntity(EntityManager em) {
        Buyer buyer = new Buyer()
            .name(DEFAULT_NAME)
            .email(DEFAULT_EMAIL)
            .cpf(DEFAULT_CPF);
        return buyer;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Buyer createUpdatedEntity(EntityManager em) {
        Buyer buyer = new Buyer()
            .name(UPDATED_NAME)
            .email(UPDATED_EMAIL)
            .cpf(UPDATED_CPF);
        return buyer;
    }

    @BeforeEach
    public void initTest() {
        buyer = createEntity(em);
    }

    @Test
    @Transactional
    public void createBuyer() throws Exception {
        int databaseSizeBeforeCreate = buyerRepository.findAll().size();

        // Create the Buyer
        restBuyerMockMvc.perform(post("/api/buyers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(buyer)))
            .andExpect(status().isCreated());

        // Validate the Buyer in the database
        List<Buyer> buyerList = buyerRepository.findAll();
        assertThat(buyerList).hasSize(databaseSizeBeforeCreate + 1);
        Buyer testBuyer = buyerList.get(buyerList.size() - 1);
        assertThat(testBuyer.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testBuyer.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testBuyer.getCpf()).isEqualTo(DEFAULT_CPF);
    }

    @Test
    @Transactional
    public void createBuyerWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = buyerRepository.findAll().size();

        // Create the Buyer with an existing ID
        buyer.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restBuyerMockMvc.perform(post("/api/buyers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(buyer)))
            .andExpect(status().isBadRequest());

        // Validate the Buyer in the database
        List<Buyer> buyerList = buyerRepository.findAll();
        assertThat(buyerList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = buyerRepository.findAll().size();
        // set the field null
        buyer.setName(null);

        // Create the Buyer, which fails.

        restBuyerMockMvc.perform(post("/api/buyers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(buyer)))
            .andExpect(status().isBadRequest());

        List<Buyer> buyerList = buyerRepository.findAll();
        assertThat(buyerList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkEmailIsRequired() throws Exception {
        int databaseSizeBeforeTest = buyerRepository.findAll().size();
        // set the field null
        buyer.setEmail(null);

        // Create the Buyer, which fails.

        restBuyerMockMvc.perform(post("/api/buyers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(buyer)))
            .andExpect(status().isBadRequest());

        List<Buyer> buyerList = buyerRepository.findAll();
        assertThat(buyerList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkCpfIsRequired() throws Exception {
        int databaseSizeBeforeTest = buyerRepository.findAll().size();
        // set the field null
        buyer.setCpf(null);

        // Create the Buyer, which fails.

        restBuyerMockMvc.perform(post("/api/buyers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(buyer)))
            .andExpect(status().isBadRequest());

        List<Buyer> buyerList = buyerRepository.findAll();
        assertThat(buyerList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllBuyers() throws Exception {
        // Initialize the database
        buyerRepository.saveAndFlush(buyer);

        // Get all the buyerList
        restBuyerMockMvc.perform(get("/api/buyers?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(buyer.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL.toString())))
            .andExpect(jsonPath("$.[*].cpf").value(hasItem(DEFAULT_CPF.intValue())));
    }
    
    @Test
    @Transactional
    public void getBuyer() throws Exception {
        // Initialize the database
        buyerRepository.saveAndFlush(buyer);

        // Get the buyer
        restBuyerMockMvc.perform(get("/api/buyers/{id}", buyer.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(buyer.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL.toString()))
            .andExpect(jsonPath("$.cpf").value(DEFAULT_CPF.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingBuyer() throws Exception {
        // Get the buyer
        restBuyerMockMvc.perform(get("/api/buyers/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateBuyer() throws Exception {
        // Initialize the database
        buyerRepository.saveAndFlush(buyer);

        int databaseSizeBeforeUpdate = buyerRepository.findAll().size();

        // Update the buyer
        Buyer updatedBuyer = buyerRepository.findById(buyer.getId()).get();
        // Disconnect from session so that the updates on updatedBuyer are not directly saved in db
        em.detach(updatedBuyer);
        updatedBuyer
            .name(UPDATED_NAME)
            .email(UPDATED_EMAIL)
            .cpf(UPDATED_CPF);

        restBuyerMockMvc.perform(put("/api/buyers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedBuyer)))
            .andExpect(status().isOk());

        // Validate the Buyer in the database
        List<Buyer> buyerList = buyerRepository.findAll();
        assertThat(buyerList).hasSize(databaseSizeBeforeUpdate);
        Buyer testBuyer = buyerList.get(buyerList.size() - 1);
        assertThat(testBuyer.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testBuyer.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testBuyer.getCpf()).isEqualTo(UPDATED_CPF);
    }

    @Test
    @Transactional
    public void updateNonExistingBuyer() throws Exception {
        int databaseSizeBeforeUpdate = buyerRepository.findAll().size();

        // Create the Buyer

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBuyerMockMvc.perform(put("/api/buyers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(buyer)))
            .andExpect(status().isBadRequest());

        // Validate the Buyer in the database
        List<Buyer> buyerList = buyerRepository.findAll();
        assertThat(buyerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteBuyer() throws Exception {
        // Initialize the database
        buyerRepository.saveAndFlush(buyer);

        int databaseSizeBeforeDelete = buyerRepository.findAll().size();

        // Delete the buyer
        restBuyerMockMvc.perform(delete("/api/buyers/{id}", buyer.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Buyer> buyerList = buyerRepository.findAll();
        assertThat(buyerList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Buyer.class);
        Buyer buyer1 = new Buyer();
        buyer1.setId(1L);
        Buyer buyer2 = new Buyer();
        buyer2.setId(buyer1.getId());
        assertThat(buyer1).isEqualTo(buyer2);
        buyer2.setId(2L);
        assertThat(buyer1).isNotEqualTo(buyer2);
        buyer1.setId(null);
        assertThat(buyer1).isNotEqualTo(buyer2);
    }
}
