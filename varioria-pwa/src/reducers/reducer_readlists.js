import _ from 'lodash';
import {
  READLIST_GET_MY,
} from '../actions/types';

export default function (state = [], action) {
  switch (action.type) {
    case READLIST_GET_MY:
      const createdReadlists = action.payload.data.created_readlists;
      const collectedReadlists = action.payload.data.collected_readlists;
      return _.extend({}, state,
        { createdReadlists: createdReadlists,
          collectedReadlists: collectedReadlists
        });
    default:
      return state;
  }
}