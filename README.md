# Почему Redux это плохо?

## Проблемы Redux:

1. Слишком много сервисного кода
2. Слишком сложно, порог вхождения в проект выше чем на реализации стейт-менеджмента на иструментах React.
3. Слишком много зависимостей извне (redux, react-redux, redux-thunk, redux-saga, redux-zero для уменьшения бойлерплейта,
   reselect для мемоизации селекторов ). Необходимо это все изучить, а главное ограничения всего этого многообразия сторонних решений.
4. Один глобальный стор для всего приложения. Мы бы хотели, чтоб наши бизнес-сущности ничего не знали друг о друге.
5. Слишком много паттернов (переиспользование экшенов, дробление редьюсеров, immutable.js и т.д.)
6. Сторонний DI, постоянное описывания useDispatch + useSelector / mapStateToProps + mapDispatchToProps

## Какой же выход?

Мы можем огранизовать наш стейт-менеджер на инстурментах React и ни капли не потярем от этого, а только приобретем.

1. Минимум сервисного кода, только API React.
2. Ниже порог вхождения, пункт 1.
3. Никаких сторонних зависимостей, только React.
4. Нет глобального стора. Все части независимы друг от друга, обеспечивают паттерн Single Responsibility (один хук - одна операция).
5. Два паттерна - React Hooks & React Context API
6. DI React API.

## Для начала посмотрим на минималистичную реализацию Redux.

my-provider.js
my-redux.j

Очень много магии (здесь ее видно, но при использовании самого Redux - вы этого не видите - о которой начинающие разработчики даже не задумываются), очень много преобразований, нет асинхронности из коробки (необходимо описывать applyMiddleware)

Это еще минимизированная версия. А еще action types, action creators в чистом Redux.

Что происходит в этом коде? (my-redux.j)

1. Initial store state.
2. multipleReducer - pure function, которая примет стейт и некий экшн, обработает его и вернет стейт.
3. numbersReducer - pure function, которая примет стейт и некий экшн, обработает его и вернет стейт.
4. combineReducers - функция, которая примет наш объект с ключами и значениями (редьсеры) и спамит из него один редьюсер (ключу редьюсера присвоится его вызов).
5. applyMiddleware - функция, которая примет некий middleware, вернет функцию createStoreWithMiddleware, которая принимает createStore и возвращается функцию, которая принимает rootReducer и Initial store state, создается store и возращает dispatch с примененным middleware и getState.
6. Функция createStore, тут все просто, на вход она принимает rootReducer, Initial store state и возвращается dispatch и getState.
7. Функция thunk, принимает store, возвращает функцию, которая принимает dispatch и возвращает функцию, которая принимает action.

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
