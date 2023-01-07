import { ReactElement, useEffect, useRef } from "react";
import { useState } from "react";
import {
    AppShell,
    Navbar,
    Header,
    Footer,
    Aside,
    Text,
    MediaQuery,
    Burger,
    useMantineTheme,
    Button,
    createStyles,
    MantineTheme,
    Center,
} from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import AddAccountModal, { AddAccountModalHandler } from "./add-account-modal";

const links = [
    { link: "/shell/home", name: "Home" },
    { link: "/shell/user", name: "User" },
    { link: "/shell/users", name: "Users" },
    { link: "/shell/accounts", name: "Accounts" },
];

const useStyles = createStyles((theme, _params, getRef) => {
    return {
        link: {
            ...theme.fn.focusStyles(),
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            fontSize: theme.fontSizes.sm,
            color: theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7],
            padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
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
    };
});

export default function Shell({ children }: { children: ReactElement }) {
    const router = useRouter();
    const currentPath = router.asPath.split("/")[2];
    const theme = useMantineTheme();
    const [sidebarOpened, setSidebarOpened] = useState(false);
    const [activeSelection, setActiveSelection] = useState(currentPath);
    const { cx, classes } = useStyles();

    const createButton = (link: string, name: string) => {
        const nameLowerCase = name.toLocaleLowerCase();
        return (
            <a
                className={cx(classes.link, {
                    [classes.linkActive]: nameLowerCase === currentPath && nameLowerCase === activeSelection,
                })}
                href={link}
                key={link}
                onClick={event => {
                    event.preventDefault();

                    setActiveSelection(nameLowerCase);
                    setSidebarOpened(prev => !prev);

                    router.push(link);
                }}>
                <span>{name}</span>
            </a>
        );
    };

    const shellRef = useRef<AddAccountModalHandler>(null);

    return (
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
                    <Navbar.Section grow>{links.map(link => createButton(link.link, link.name))}</Navbar.Section>
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
                        <Center>{createButton("/login", "Back to Login")}</Center>
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
            <main>{children}</main>
        </AppShell>
    );
}
