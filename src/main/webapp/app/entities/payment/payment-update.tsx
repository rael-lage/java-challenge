import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IClient } from 'app/shared/model/client.model';
import { getEntities as getClients } from 'app/entities/client/client.reducer';
import { IBuyer } from 'app/shared/model/buyer.model';
import { getEntities as getBuyers } from 'app/entities/buyer/buyer.reducer';
import { ICard } from 'app/shared/model/card.model';
import { getEntities as getCards } from 'app/entities/card/card.reducer';
import { IBoleto } from 'app/shared/model/boleto.model';
import { getEntities as getBoletos } from 'app/entities/boleto/boleto.reducer';
import { getEntity, updateEntity, createEntity, reset } from './payment.reducer';
import { IPayment } from 'app/shared/model/payment.model';
import { convertDateTimeFromServer, convertDateTimeToServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IPaymentUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface IPaymentUpdateState {
  isNew: boolean;
  clientId: string;
  buyerId: string;
  cardId: string;
  boletoId: string;
}

export class PaymentUpdate extends React.Component<IPaymentUpdateProps, IPaymentUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      clientId: '0',
      buyerId: '0',
      cardId: '0',
      boletoId: '0',
      isNew: !this.props.match.params || !this.props.match.params.id
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.updateSuccess !== this.props.updateSuccess && nextProps.updateSuccess) {
      this.handleClose();
    }
  }

  componentDidMount() {
    if (this.state.isNew) {
      this.props.reset();
    } else {
      this.props.getEntity(this.props.match.params.id);
    }

    this.props.getClients();
    this.props.getBuyers();
    this.props.getCards();
    this.props.getBoletos();
  }

  saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const { paymentEntity } = this.props;
      const entity = {
        ...paymentEntity,
        ...values
      };

      if (this.state.isNew) {
        this.props.createEntity(entity);
      } else {
        this.props.updateEntity(entity);
      }
    }
  };

  handleClose = () => {
    this.props.history.push('/entity/payment');
  };

  render() {
    const { paymentEntity, clients, buyers, cards, boletos, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="javaChallengeApp.payment.home.createOrEditLabel">Create or edit a Payment</h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : paymentEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="payment-id">ID</Label>
                    <AvInput id="payment-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="amountLabel" for="payment-amount">
                    Amount
                  </Label>
                  <AvField
                    id="payment-amount"
                    type="text"
                    name="amount"
                    validate={{
                      required: { value: true, errorMessage: 'This field is required.' },
                      number: { value: true, errorMessage: 'This field should be a number.' }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="typeLabel" for="payment-type">
                    Type
                  </Label>
                  <AvInput
                    id="payment-type"
                    type="select"
                    className="form-control"
                    name="type"
                    value={(!isNew && paymentEntity.type) || 'CREDITCARD'}
                  >
                    <option value="CREDITCARD">CREDITCARD</option>
                    <option value="BOLETO">BOLETO</option>
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label id="statusLabel" for="payment-status">
                    Status
                  </Label>
                  <AvInput
                    id="payment-status"
                    type="select"
                    className="form-control"
                    name="status"
                    value={(!isNew && paymentEntity.status) || 'APPROVED'}
                  >
                    <option value="APPROVED">APPROVED</option>
                    <option value="REFUSED">REFUSED</option>
                    <option value="CANCELED">CANCELED</option>
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label for="payment-client">Client</Label>
                  <AvInput id="payment-client" type="select" className="form-control" name="client.id">
                    <option value="" key="0" />
                    {clients
                      ? clients.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.id}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label for="payment-buyer">Buyer</Label>
                  <AvInput id="payment-buyer" type="select" className="form-control" name="buyer.id">
                    <option value="" key="0" />
                    {buyers
                      ? buyers.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.id}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label for="payment-card">Card</Label>
                  <AvInput id="payment-card" type="select" className="form-control" name="card.id">
                    <option value="" key="0" />
                    {cards
                      ? cards.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.id}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label for="payment-boleto">Boleto</Label>
                  <AvInput id="payment-boleto" type="select" className="form-control" name="boleto.id">
                    <option value="" key="0" />
                    {boletos
                      ? boletos.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.id}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/payment" replace color="info">
                  <FontAwesomeIcon icon="arrow-left" />
                  &nbsp;
                  <span className="d-none d-md-inline">Back</span>
                </Button>
                &nbsp;
                <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                  <FontAwesomeIcon icon="save" />
                  &nbsp; Save
                </Button>
              </AvForm>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  clients: storeState.client.entities,
  buyers: storeState.buyer.entities,
  cards: storeState.card.entities,
  boletos: storeState.boleto.entities,
  paymentEntity: storeState.payment.entity,
  loading: storeState.payment.loading,
  updating: storeState.payment.updating,
  updateSuccess: storeState.payment.updateSuccess
});

const mapDispatchToProps = {
  getClients,
  getBuyers,
  getCards,
  getBoletos,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentUpdate);
