# Почему Redux это плохо?

## Проблемы Redux:

1. Слишком много сервисного кода
2. Слишком сложно, порог вхождения в проект выше чем на реализации стейт-менеджмента на иструментах React.
3. Слишком много зависимостей извне (redux, react-redux, redux-thunk, redux-saga, redux-zero для уменьшения бойлерплейта,
   reselect для мемоизации селекторов ). Необходимо это все изучить, а главное ограничения всего этого многообразия сторонних решений.
4. Один глобальный стор для всего приложения. Мы бы хотели, чтоб наши бизнес-сущности ничего не знали друг о друге.
5. Слишком много паттернов (переиспользование экшенов, дробление редьюсеров, immutable.js и т.д.)
6. Сторонний DI, но явный, постоянное описывания useDispatch + useSelector / mapStateToProps + mapDispatchToProps.
7. Множество истоничков истины.

## Какой же выход?

Мы можем огранизовать наш стейт-менеджер на инстурментах React и ни капли не потярем от этого, а только приобретем.

1. Минимум сервисного кода, только API React.
2. Ниже порог вхождения, пункт 1.
3. Никаких сторонних зависимостей, только React.
4. Нет глобального стора. Все части независимы друг от друга, обеспечивают паттерн Single Responsibility (один хук - одна операция).
5. Два паттерна - React Hooks & React Context API
6. Единственный источник истины.

Минусом неявный DI.

## Для начала посмотрим на минималистичную реализацию Redux.

my-provider.js
my-redux.js

Очень много магии (здесь ее видно, но при использовании самого Redux - вы этого не видите - о которой начинающие разработчики даже не задумываются), очень много преобразований, нет асинхронности из коробки (необходимо описывать applyMiddleware)

Это еще минимизированная версия. А еще action types, action creators в чистом Redux.

Что происходит в этом коде? (my-redux.js)

1. Initial store state.

```javascript
const initialState = {
  multiple: {
    number: 0,
  },
  numbers: { number: 0 },
};
```

2. multipleReducer - pure function, которая примет стейт и некий экшн, обработает его и вернет стейт.
3. numbersReducer - pure function, которая примет стейт и некий экшн, обработает его и вернет стейт.

```javascript
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
```

4. combineReducers - функция, которая примет наш объект с ключами и значениями (редьсеры) и спамит из него один редьюсер (ключу редьюсера присвоится его вызов).

```javascript
function combineReducers(reducersMap) {
  return function combinationReducer(state, action) {
    const nextState = {};

    Object.entries(reducersMap).forEach(([key, reducer]) => {
      nextState[key] = reducer(state[key], action);
    });
    return nextState;
  };
}

const rootReducer = combineReducers({
  multiple: multipleReducer,
  numbers: numbersReducer,
});
```

5. applyMiddleware - функция, которая примет некий middleware, вернет функцию createStoreWithMiddleware, которая принимает createStore и возвращается функцию, которая принимает rootReducer и Initial store state, создается store и возращает dispatch с примененным middleware и getState.

```javascript
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
```

6. Функция createStore, тут все просто, на вход она принимает rootReducer, Initial store state и возвращается dispatch и getState.

```javascript
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
```

7. Функция thunk, принимает store, возвращает функцию, которая принимает dispatch и возвращает функцию, которая принимает action.

```javascript
const thunk = (store) => (dispatch) => (action) => {
  if (typeof action === "function") {
    return action(store.getState);
  }
  return dispatch(action);
};
```

8. Создание store.

```javascript
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

export const store = createStoreWithMiddleware(rootReducer);
```

Это вся концепция Redux.

Но сколько необходимо знать, чтоб понимать ее и сколько мест, где может возникнуть ошибка?

Что происходит в my-provider.js?

```javascript
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
```

Для простоты примера, я создал хук, который будет обновлять некое состояние и вызываться при каждом dispatch. Это необходимо, чтоб при обновлении нашего store его потребители получали обновленный store.

Просто ли разобраться в этом человеку, который пришел на проект и до этого не использовал Redux?

## Что я предлагаю?

Отказаться от всех стейт-менеджеров и реализовывать управление только в рамках React.

Задайте себе вопрос зачем вам Redux?

Делать запросы на сервер и хранить данные?

Это легко реализовать простым хуком, в этом примере useGet:

```javascript
import axios, { AxiosRequestConfig } from "axios";
import { useCallback, useEffect, useState } from "react";

export const useGet = <ResponseData = any>(url: string) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [result, setResult] = useState<ResponseData>();

  const [error, setError] = useState<string>();

  const get = useCallback(
    (params?: AxiosRequestConfig["params"]) => {
      setIsLoading(true);
      setError(undefined);
      setResult(undefined);
      return axios
        .get<ResponseData>(url, { params })
        .then((response) => {
          setResult(response.data);
          setError(undefined);
        })
        .catch((e) => {
          setResult(undefined);
          setError(e.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [url]
  );

  useEffect(() => {
    return () => {
      setIsLoading(false);
      setError(undefined);
      setResult(undefined);
    };
  }, []);

  return { get, isLoading, error, result };
};
```

### Плюсы.

1. Signle Responsibility.
2. Immutable.
3. API React.
4. Легко комбинировать несколько хуков.
5. Единственный источник истины.
6. При необходимости нескольким потребителям легко использовать в Provider.
7. Нет сервисного кода.
8. Хуки не знают ничего друг о друге.
