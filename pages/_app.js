import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import "@fontsource/poppins/300.css";
import theme from "../theme";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
