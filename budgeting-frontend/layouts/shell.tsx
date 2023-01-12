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
} from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";

// React
import { ReactElement, useRef, createContext } from "react";
import { useState } from "react";
import { useRouter } from "next/router";

// Components
import AddAccountModal, { AddAccountModalHandler } from "../components/account/add-account-modal";
import ClientOnly from "../components/client-only";

// Graphql
import { useQuery } from "@apollo/client";
import { User } from "../graphql/__generated__/graphql";
import GET_ME from "../graphql/queries/get-me";

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
  const runUserQuery = useQuery(GET_ME, { onCompleted: data => console.info("User set in context", data.me) });
  const { data: user, loading: userLoading, error: userError } = runUserQuery;

  // Get list of accounts for collapsible buttons
  const accounts = user?.me?.accounts.map(account => {
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

  const shellRef = useRef<AddAccountModalHandler>(null);

  const sidebarLinks = user?.me?.role === "admin" ? links.concat({ link: "/shell/users", name: "Users" }) : links;

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
              <AddAccountModal ref={shellRef}>
                <Center>
                  <Button bg="black" onClick={() => shellRef?.current?.toggleOpen()}>
                    Add Account
                  </Button>
                </Center>
              </AddAccountModal>
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

              <Text color="white" weight={700}>
                Budgeting App
              </Text>
            </div>
          </Header>
        }>
        {userLoading ? (
          <Center h={height} w={width}>
            {" "}
            <Loader />{" "}
          </Center>
        ) : userError ? (
          <Center h={height} w={width}>
            <Text>User needs to be logged in.</Text>
          </Center>
        ) : (
          <main>
            <UserContext.Provider value={user?.me ? user?.me : null}>{children}</UserContext.Provider>
          </main>
        )}
      </AppShell>
    </ClientOnly>
  );
}
