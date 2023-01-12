import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import client from "../lib/apollo-client";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import ReconcileAccountModal from "../components/account/reconcile-account-modal";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? (page => page);

  return (
    <ApolloProvider client={client}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "light",
          fontFamily: "Helvetica",
          spacing: { xs: 15, sm: 20, md: 25, lg: 30, xl: 40 },
        }}>
        <NotificationsProvider>
          <ModalsProvider
            modals={{ reconcileAccount: ReconcileAccountModal }}
            labels={{ confirm: "Submit", cancel: "Cancel" }}>
            {/* Get the layout of the page */}
            {getLayout(<Component {...pageProps} />)}
          </ModalsProvider>
        </NotificationsProvider>
      </MantineProvider>
    </ApolloProvider>
  );
}
