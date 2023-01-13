// Mantine
import {
  AppShell,
  Navbar,
  Header,
  Group,
  Collapse,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  Button,
  createStyles,
  Box,
  Center,
  Loader,
  NativeSelect,
  Container,
  Flex,
} from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { ModalsProvider, openContextModal } from "@mantine/modals";

// React
import { ReactElement, createContext } from "react";
import { useState } from "react";
import { useRouter } from "next/router";

// Components
import ClientOnly from "../components/client-only";
import AddAccountModal from "../components/account/add-account-modal";
import ReconcileAccountModal from "../components/account/reconcile-account-modal";
import AddTransactionModal from "../components/account/add-transaction-modal";
import EditTransactionModal from "../components/account/edit-transaction-modal";

// Graphql
import { useQuery } from "@apollo/client";
import GET_ME from "../graphql/queries/get-me";
import { User } from "../graphql/__generated__/graphql";
import useCurrency from "../hooks/useCurrency";

const useStyles = createStyles((theme, _params, getRef) => {
  return {
    link: {
      ...theme.fn.focusStyles(),
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      fontSize: theme.fontSizes.sm,
      color: theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.xs}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      "&:hover": {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
        color: theme.colorScheme === "dark" ? theme.white : theme.black,
      },
    },
    linkActive: {
      "&, &:hover": {
        backgroundColor: theme.fn.variant({ variant: "light", color: theme.primaryColor }).background,
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor }).color,
      },
    },
    collapsible: {
      fontWeight: 500,
      display: "block",
      textDecoration: "none",
      padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
      paddingLeft: 31,
      marginLeft: 30,
      fontSize: theme.fontSizes.sm,
      color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],
      borderLeft: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]}`,

      "&:hover": {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0],
        color: theme.colorScheme === "dark" ? theme.white : theme.black,
      },
    },
    chevron: {
      transition: "transform 200ms ease",
    },
  };
});

const links = [
  { link: "/shell/home", name: "Home" },
  { link: "/shell/user", name: "User" },
];

export const UserContext = createContext<User | null>(null);
export const CurrencyContext = createContext<string>("CAD");

export default function Shell({ children }: { children: ReactElement }) {
  // Router
  const router = useRouter();
  const currentPath = router.asPath.split("/")[2];

  // Themes
  const theme = useMantineTheme();
  const { cx, classes } = useStyles();
  const { height, width } = useViewportSize();

  // States
  const [activeSelection, setActiveSelection] = useState(currentPath);
  const [sidebarOpened, setSidebarOpened] = useState(false);
  const [showAccounts, setShowAccount] = useState(false);

  // API calls
  const {
    data: user,
    loading: userLoading,
    error: userError,
  } = useQuery(GET_ME, {
    onCompleted: data => {
      if (!data.me) router.push("/unauthenticated");
      else console.log("User logged in", data.me);
    },
    onError: error => {
      console.error(error.graphQLErrors[0].message);
      router.push("/unauthenticated");
    },
  });

  // Currency
  const [selectedCurrency, setSelectedCurrency] = useState<string>("CAD");

  if (userLoading) {
    return (
      <Center h={height} w={width}>
        <Loader />
      </Center>
    );
  }

  if (!user || !user?.me || userError) {
    router.push("/unauthenticated");
    return <></>;
  }

  // Get list of accounts for collapsible buttons
  const accounts = user.me.accounts.map(account => {
    const currentAccountInPath = router.asPath.split("/")[3];

    return (
      <Text<"a">
        component="a"
        className={cx(classes.collapsible, { [classes.linkActive]: account?._id === currentAccountInPath })}
        href={`/shell/account/${account?._id}`}
        key={account?._id}
        onClick={event => {
          event.preventDefault();
          router.push(`/shell/account/${account?._id}`);
        }}>
        <Group spacing={0} position="apart">
          <Box>{account?.name}</Box>
          <Box>{account?.balance.toLocaleString("en-US", { style: "currency", currency: "USD" })}</Box>
        </Group>
      </Text>
    );
  });

  // Create buttons on sidebar, optionally contains collapsible elements
  type CreateButtonInput = {
    link: string;
    name: string;
    collapsibleFn?: () => void;
    openCollapsible?: boolean;
    collapsibleElem?: JSX.Element[];
  };

  const createButton = ({ link, name, collapsibleFn, openCollapsible, collapsibleElem }: CreateButtonInput) => {
    const nameLowerCase = name.toLocaleLowerCase();
    return (
      <div key={link}>
        <a
          className={cx(classes.link, {
            [classes.linkActive]: nameLowerCase === currentPath && nameLowerCase === activeSelection,
          })}
          href={link}
          onClick={event => {
            event.preventDefault();
            setActiveSelection(nameLowerCase);
            setSidebarOpened(prev => !prev);
            collapsibleFn && collapsibleFn();
            if (!collapsibleFn) router.push(link);
          }}>
          <span>{name}</span>
        </a>
        <Collapse in={openCollapsible ?? false}>{collapsibleElem}</Collapse>
      </div>
    );
  };

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
              {sidebarLinks.map(link => createButton({ link: link.link, name: link.name }))}
              {createButton({
                link: "/shell/accounts",
                name: "Accounts",
                collapsibleFn: () => setShowAccount(o => !o),
                collapsibleElem: accounts,
                openCollapsible: showAccounts,
              })}
            </Navbar.Section>
            <Navbar.Section>
              <Center>
                <Button bg="black" onClick={() => handleAddAccount()}>
                  Add Account
                </Button>
              </Center>
            </Navbar.Section>
            <Navbar.Section>
              <Center>{createButton({ link: "/login", name: "Back to Login" })}</Center>
            </Navbar.Section>
          </Navbar>
        }
        header={
          <Header height={{ base: 50, md: 70 }} p="md" bg="black">
            <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <Burger
                  opened={sidebarOpened}
                  onClick={() => setSidebarOpened(o => !o)}
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
                    onChange={event => setSelectedCurrency(event.currentTarget.value)}
                  />
                </Flex>
              </Group>
            </div>
          </Header>
        }>
        {userLoading ? (
          <Center h={height} w={width}>
            <Loader />
          </Center>
        ) : userError ? (
          <Center h={height} w={width}>
            <Text>User needs to be logged in.</Text>
          </Center>
        ) : (
          <main>
            <UserContext.Provider value={user.me}>
              <CurrencyContext.Provider value={selectedCurrency}>
                <ModalsProvider
                  modals={{
                    reconcileAccount: ReconcileAccountModal,
                    addTransaction: AddTransactionModal,
                    editTransaction: EditTransactionModal,
                    addAccount: AddAccountModal,
                  }}
                  labels={{ confirm: "Submit", cancel: "Cancel" }}>
                  {children}
                </ModalsProvider>
              </CurrencyContext.Provider>
            </UserContext.Provider>
          </main>
        )}
      </AppShell>
    </ClientOnly>
  );
}
