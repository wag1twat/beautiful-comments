import { render } from "react-dom";
import { ChakraProvider } from "@chakra-ui/react";

import { BeautifulComments } from "./BeautifulComments";

import { Provider } from "react-redux";
import { store } from "./UglyComments/store";
import { UglyComments } from "./UglyComments";

import { StoreProvider } from "my-provider";
import { store as myStore } from "my-redux";

const rootElement = document.getElementById("root");

// render(
//   <Provider store={store}>
//     <ChakraProvider>
//       <UglyComments />
//     </ChakraProvider>
//   </Provider>,
//   rootElement
// );

render(
  <ChakraProvider>
    <BeautifulComments />
  </ChakraProvider>,
  rootElement
);

// render(
//   <StoreProvider store={myStore}>
//     <ChakraProvider>
//       <BeautifulComments />
//     </ChakraProvider>
//   </StoreProvider>,
//   rootElement
// );
