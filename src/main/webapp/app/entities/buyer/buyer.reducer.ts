import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IBuyer, defaultValue } from 'app/shared/model/buyer.model';

export const ACTION_TYPES = {
  FETCH_BUYER_LIST: 'buyer/FETCH_BUYER_LIST',
  FETCH_BUYER: 'buyer/FETCH_BUYER',
  CREATE_BUYER: 'buyer/CREATE_BUYER',
  UPDATE_BUYER: 'buyer/UPDATE_BUYER',
  DELETE_BUYER: 'buyer/DELETE_BUYER',
  RESET: 'buyer/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IBuyer>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type BuyerState = Readonly<typeof initialState>;

// Reducer

export default (state: BuyerState = initialState, action): BuyerState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_BUYER_LIST):
    case REQUEST(ACTION_TYPES.FETCH_BUYER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_BUYER):
    case REQUEST(ACTION_TYPES.UPDATE_BUYER):
    case REQUEST(ACTION_TYPES.DELETE_BUYER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_BUYER_LIST):
    case FAILURE(ACTION_TYPES.FETCH_BUYER):
    case FAILURE(ACTION_TYPES.CREATE_BUYER):
    case FAILURE(ACTION_TYPES.UPDATE_BUYER):
    case FAILURE(ACTION_TYPES.DELETE_BUYER):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_BUYER_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_BUYER):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_BUYER):
    case SUCCESS(ACTION_TYPES.UPDATE_BUYER):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_BUYER):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const apiUrl = 'api/buyers';

// Actions

export const getEntities: ICrudGetAllAction<IBuyer> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_BUYER_LIST,
  payload: axios.get<IBuyer>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<IBuyer> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_BUYER,
    payload: axios.get<IBuyer>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IBuyer> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_BUYER,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IBuyer> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_BUYER,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IBuyer> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_BUYER,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
