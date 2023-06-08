import { Box, ChakraProvider, extendTheme } from "@chakra-ui/react";
import "reset-css";
import { StoreProvider } from "easy-peasy";
import { useRouter } from "next/router";
import { CookiesProvider } from "react-cookie";
import { ErrorBoundary as SentryErrorBoundry } from "@sentry/react";
import { store } from "../lib/store";
import logger from "../lib/client-logger";
import { AuthProvider } from "../components/auth/authProvider";
import ErrorAlert from "../components/alert/errorAlert";

const theme = extendTheme();
logger.message("Initializing app", "debug");

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();
  return (
    <AuthProvider>
      <ChakraProvider theme={theme}>
        <StoreProvider store={store}>
          <CookiesProvider>
            <SentryErrorBoundry
              fallback={<ErrorAlert message="An Expected Error Occured" />}
              showDialog={process.env.NODE_ENV !== "production"}
            >
              <Box key={router.asPath}>
                <Component {...pageProps} />
              </Box>
            </SentryErrorBoundry>
          </CookiesProvider>
        </StoreProvider>
      </ChakraProvider>
    </AuthProvider>
  );
};

export default MyApp;
