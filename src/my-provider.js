import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
} from "react";

const ctx = createContext();

const forceUpdateReducer = (i) => i + 1;

export const useForceUpdate = () => {
  const [, forceUpdate] = useReducer(forceUpdateReducer, 0);
  return forceUpdate;
};

export const StoreProvider = ({ store, ...props }) => {
  const forceUpdate = useForceUpdate();

  const { dispatch, getState } = store;
  return (
    <ctx.Provider
      value={{
        dispatch: useCallback(dispatch(forceUpdate), []),
        getState: useCallback(getState, []),
      }}
      {...props}
    />
  );
};

export const useStore = () => {
  return useContext(ctx);
};
