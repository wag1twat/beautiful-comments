const initialState = {
  multiple: {
    number: 0,
  },
  numbers: { number: 0 },
};

const multipleReducer = (
  state = {
    number: 0,
  },
  action
) => {
  switch (action.type) {
    case "MULTIPLE": {
      return { ...state, number: action.payload * action.step };
    }
    default:
      return state;
  }
};

const numbersReducer = (state = { number: 0 }, action) => {
  switch (action.type) {
    case "INCREMENT": {
      return { ...state, number: action.payload };
    }
    default:
      return state;
  }
};

function combineReducers(reducersMap) {
  return function combinationReducer(state, action) {
    const nextState = {};

    Object.entries(reducersMap).forEach(([key, reducer]) => {
      nextState[key] = reducer(state[key], action);
    });
    return nextState;
  };
}

function applyMiddleware(middleware) {
  return function createStoreWithMiddleware(createStore) {
    return (reducer, state) => {
      const store = createStore(reducer, state);

      return {
        dispatch: (forceUpdate) => (action) =>
          middleware(store)(store.dispatch(forceUpdate))(action),
        getState: store.getState,
      };
    };
  };
}

const rootReducer = combineReducers({
  multiple: multipleReducer,
  numbers: numbersReducer,
});

export const createStore = function (reducer, _initialState = initialState) {
  let state = _initialState;
  return {
    dispatch: (forceUpdate) => (action) => {
      state = reducer(state, action);
      forceUpdate();
    },
    getState: () => state,
  };
};

const thunk = (store) => (dispatch) => (action) => {
  if (typeof action === "function") {
    return action(store.getState);
  }
  return dispatch(action);
};

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

export const store = createStoreWithMiddleware(rootReducer);
