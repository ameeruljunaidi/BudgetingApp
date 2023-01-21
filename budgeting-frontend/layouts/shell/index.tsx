import { AppShell, LoadingOverlay, useMantineTheme } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";

import { createContext, ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/router";

import ClientOnly from "../../components/client-only";
import AddAccountModal from "../../components/account/add-account-modal";
import ReconcileAccountModal from "../../components/account/reconcile-account-modal";
import AddTransactionModal from "../../components/transaction/add-modal";
import EditTransactionModal from "../../components/transaction/edit-modal";

import { useQuery } from "@apollo/client";
import GET_ME from "../../graphql/queries/get-me";
import { User } from "../../graphql/__generated__/graphql";
import ShellNavbar from "./shell-navbar";
import ShellHeader from "./shell-header";
import EditAccountModal from "../../components/account/edit-account-modal";

export const UserContext = createContext<User | null>(null);
export const CurrencyContext = createContext<string>("CAD");

export default function Shell({ children }: { children: ReactElement }) {
  const router = useRouter();
  const theme = useMantineTheme();
  const [sidebarOpened, setSidebarOpened] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>(
    typeof window !== "undefined" ? localStorage.getItem("globalCurrency") ?? "CAD" : "CAD"
  );

  const { data: user, loading: userLoading } = useQuery(GET_ME, {
    onCompleted: (data) => {
      if (data.me === null) void router.push("/login");
      else console.log("User logged in", data.me);
    },
    onError: (error) => {
      console.error(error?.graphQLErrors[0]?.message);
      void router.push("/login");
    },
  });

  return (
    <ClientOnly>
      <UserContext.Provider value={user?.me ?? null}>
        <CurrencyContext.Provider value={selectedCurrency}>
          <ModalsProvider
            modals={{
              reconcileAccount: ReconcileAccountModal,
              addTransaction: AddTransactionModal,
              editTransaction: EditTransactionModal,
              addAccount: AddAccountModal,
              editAccount: EditAccountModal,
            }}
            labels={{ confirm: "Submit", cancel: "Cancel" }}
          >
            <LoadingOverlay visible={userLoading} overlayBlur={2} />
            <AppShell
              styles={{
                main: {
                  background: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
                },
              }}
              navbarOffsetBreakpoint="sm"
              asideOffsetBreakpoint="sm"
              navbar={<ShellNavbar sidebarOpened={sidebarOpened} setSidebarOpened={setSidebarOpened} user={user} />}
              header={
                <ShellHeader
                  sidebarOpened={sidebarOpened}
                  setSidebarOpened={setSidebarOpened}
                  selectedCurrency={selectedCurrency}
                  setSelectedCurrency={setSelectedCurrency}
                />
              }
            >
              <main>{children}</main>
            </AppShell>
          </ModalsProvider>
        </CurrencyContext.Provider>
      </UserContext.Provider>
    </ClientOnly>
  );
}
