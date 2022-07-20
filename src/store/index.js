import { createStore } from 'redux';
// reducer层的拆离
import reducer from './reducers/user';
const store = createStore(reducer);

export default store;
