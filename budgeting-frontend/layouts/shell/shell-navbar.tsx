import { Button, Center, Divider, Navbar, ScrollArea } from "@mantine/core";
import SidebarButton from "./sidebar-button";
import AccountSidebar from "../../components/account/account-sidebar";
import { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/router";
import { MeQuery } from "../../graphql/__generated__/graphql";
import { openContextModal } from "@mantine/modals";
import TitleCard from "../../components/user/title-card";

type ShellNavbarProps = {
  sidebarOpened: boolean;
  setSidebarOpened: Dispatch<SetStateAction<boolean>>;
  user: MeQuery | undefined;
};

export default function ShellNavbar({ sidebarOpened, setSidebarOpened, user }: ShellNavbarProps) {
  const router = useRouter();
  const currentPath = router.asPath.split("/")[2];

  const [showAccounts, setShowAccount] = useState(currentPath === "account");

  const sidebarLinks = [
    { link: "/shell/home", name: "Home" },
    { link: "/shell/dashboard", name: "Dashboard" },
    { link: "/shell/report", name: "Report" },
    { link: "/shell/subscriptions", name: "Subscriptions" },
  ];

  return (
    <Navbar p="md" hiddenBreakpoint="sm" hidden={!sidebarOpened} width={{ sm: 280, lg: 350 }}>
      <Navbar.Section grow component={ScrollArea}>
        <TitleCard />

        <Divider my={4} />

        {/*Links*/}
        {sidebarLinks.map((link) => (
          <SidebarButton key={link.link} buttonLink={link} setSidebarOpened={setSidebarOpened} />
        ))}

        <Divider my={4} />

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
      <Navbar.Section pt="md">
        <Center>
          <Button
            bg="black"
            onClick={() => {
              openContextModal({
                modal: "addAccount",
                title: "Add Account",
                innerProps: {},
              });
            }}
          >
            Add Account
          </Button>
        </Center>
      </Navbar.Section>
      <Navbar.Section>
        <Center>
          <SidebarButton buttonLink={{ link: "/login", name: "Back to Login" }} setSidebarOpened={setSidebarOpened} />
        </Center>
      </Navbar.Section>
    </Navbar>
  );
}
