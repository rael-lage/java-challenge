import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './card.reducer';
import { ICard } from 'app/shared/model/card.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ICardDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class CardDetail extends React.Component<ICardDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { cardEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            Card [<b>{cardEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="holderName">Holder Name</span>
            </dt>
            <dd>{cardEntity.holderName}</dd>
            <dt>
              <span id="number">Number</span>
            </dt>
            <dd>{cardEntity.number}</dd>
            <dt>
              <span id="expirationDate">Expiration Date</span>
            </dt>
            <dd>
              <TextFormat value={cardEntity.expirationDate} type="date" format={APP_LOCAL_DATE_FORMAT} />
            </dd>
            <dt>
              <span id="cvv">Cvv</span>
            </dt>
            <dd>{cardEntity.cvv}</dd>
          </dl>
          <Button tag={Link} to="/entity/card" replace color="info">
            <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/card/${cardEntity.id}/edit`} replace color="primary">
            <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
          </Button>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = ({ card }: IRootState) => ({
  cardEntity: card.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardDetail);
