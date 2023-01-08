import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import client from "../lib/apollo-client";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? (page => page);

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: "light",
        fontFamily: "Helvetica",
        spacing: { xs: 15, sm: 20, md: 25, lg: 30, xl: 40 },
      }}>
      <NotificationsProvider>
        <ModalsProvider labels={{ confirm: "Submit", cancel: "Cancel" }}>
          <ApolloProvider client={client}>
            {/* Get the layout of the page */}
            {getLayout(<Component {...pageProps} />)}
          </ApolloProvider>
        </ModalsProvider>
      </NotificationsProvider>
    </MantineProvider>
  );
}
