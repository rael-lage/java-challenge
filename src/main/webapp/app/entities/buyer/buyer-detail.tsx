import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './buyer.reducer';
import { IBuyer } from 'app/shared/model/buyer.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IBuyerDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class BuyerDetail extends React.Component<IBuyerDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { buyerEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            Buyer [<b>{buyerEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="name">Name</span>
            </dt>
            <dd>{buyerEntity.name}</dd>
            <dt>
              <span id="email">Email</span>
            </dt>
            <dd>{buyerEntity.email}</dd>
            <dt>
              <span id="cpf">Cpf</span>
            </dt>
            <dd>{buyerEntity.cpf}</dd>
          </dl>
          <Button tag={Link} to="/entity/buyer" replace color="info">
            <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/buyer/${buyerEntity.id}/edit`} replace color="primary">
            <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
          </Button>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = ({ buyer }: IRootState) => ({
  buyerEntity: buyer.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BuyerDetail);
