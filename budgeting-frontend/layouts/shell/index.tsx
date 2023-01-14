import {
  AppShell,
  Burger,
  Button,
  Center,
  Flex,
  Group,
  Header,
  LoadingOverlay,
  MediaQuery,
  NativeSelect,
  Navbar,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { ModalsProvider, openContextModal } from "@mantine/modals";

import { createContext, ReactElement, useState } from "react";
import { useRouter } from "next/router";

import ClientOnly from "../../components/client-only";
import AddAccountModal from "../../components/account/add-account-modal";
import ReconcileAccountModal from "../../components/account/reconcile-account-modal";
import AddTransactionModal from "../../components/transaction/add-transaction-modal";
import EditTransactionModal from "../../components/transaction/edit-transaction-modal";

import { useQuery } from "@apollo/client";
import GET_ME from "../../graphql/queries/get-me";
import { User } from "../../graphql/__generated__/graphql";
import AccountSidebar from "../../components/account/account-sidebar";
import SidebarButton from "./sidebar-button";

const links = [
  { link: "/shell/home", name: "Home" },
  { link: "/shell/user", name: "User" },
];

export const UserContext = createContext<User | null>(null);
export const CurrencyContext = createContext<string>("CAD");

export default function Index({ children }: { children: ReactElement }) {
  const router = useRouter();
  const currentPath = router.asPath.split("/")[2];

  const theme = useMantineTheme();
  const { height, width } = useViewportSize();

  const [sidebarOpened, setSidebarOpened] = useState(false);
  const [showAccounts, setShowAccount] = useState(currentPath === "account");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("CAD");

  const {
    data: user,
    loading: userLoading,
    error: userError,
  } = useQuery(GET_ME, {
    onCompleted: (data) => {
      if (!data.me) router.push("/unauthenticated");
      else console.log("User logged in", data.me);
    },
    onError: (error) => {
      console.error(error.graphQLErrors[0].message);
      router.push("/unauthenticated");
    },
  });

  const sidebarLinks = user?.me?.role === "admin" ? links.concat({ link: "/shell/users", name: "Users" }) : links;

  const handleAddAccount = () => {
    openContextModal({
      modal: "addAccount",
      title: "Add Account",
      innerProps: {},
    });
  };

  return (
    <ClientOnly>
      <LoadingOverlay visible={userLoading} overlayBlur={2} />
      <AppShell
        styles={{
          main: {
            background: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
          },
        }}
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        navbar={
          <Navbar p="md" hiddenBreakpoint="sm" hidden={!sidebarOpened} width={{ sm: 200, lg: 300 }}>
            <Navbar.Section grow>
              {/*Links*/}
              {sidebarLinks.map((link) => (
                <SidebarButton key={link.link} buttonLink={link} setSidebarOpened={setSidebarOpened} />
              ))}

              {/*Accounts*/}
              <SidebarButton
                buttonLink={{ link: "/shell/accounts", name: "Accounts" }}
                setSidebarOpened={setSidebarOpened}
                openCollapsible={showAccounts}
                collapsibleElem={user?.me?.accounts.map((account) => (
                  <AccountSidebar key={account._id} account={account} />
                ))}
                collapsibleFn={() => setShowAccount((o) => !o)}
              />
            </Navbar.Section>
            <Navbar.Section>
              <Center>
                <Button bg="black" onClick={() => handleAddAccount()}>
                  Add Account
                </Button>
              </Center>
            </Navbar.Section>
            <Navbar.Section>
              <Center>
                <SidebarButton
                  buttonLink={{ link: "/login", name: "Back to Login" }}
                  setSidebarOpened={setSidebarOpened}
                />
              </Center>
            </Navbar.Section>
          </Navbar>
        }
        header={
          <Header height={{ base: 50, md: 70 }} p="md" bg="black">
            <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <Burger
                  opened={sidebarOpened}
                  onClick={() => setSidebarOpened((o) => !o)}
                  size="sm"
                  color={theme.colors.gray[6]}
                  mr="xl"
                />
              </MediaQuery>

              <Group position="apart" w={width}>
                <Text color="white" weight={700}>
                  Budgeting App
                </Text>
                <Flex align="center" columnGap={10}>
                  <Text color="white">Currency</Text>
                  <NativeSelect
                    data={["CAD", "USD", "MYR", "EUR", "GBP"]}
                    value={selectedCurrency}
                    onChange={(event) => setSelectedCurrency(event.currentTarget.value)}
                  />
                </Flex>
              </Group>
            </div>
          </Header>
        }
      >
        <main>
          <UserContext.Provider value={user?.me ?? null}>
            <CurrencyContext.Provider value={selectedCurrency}>
              <ModalsProvider
                modals={{
                  reconcileAccount: ReconcileAccountModal,
                  addTransaction: AddTransactionModal,
                  editTransaction: EditTransactionModal,
                  addAccount: AddAccountModal,
                }}
                labels={{ confirm: "Submit", cancel: "Cancel" }}
              >
                {children}
              </ModalsProvider>
            </CurrencyContext.Provider>
          </UserContext.Provider>
        </main>
      </AppShell>
    </ClientOnly>
  );
}
