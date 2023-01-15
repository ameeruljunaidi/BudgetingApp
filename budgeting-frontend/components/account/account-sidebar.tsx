import { Account } from "../../graphql/__generated__/graphql";
import { ActionIcon, Box, Container, Group, Text } from "@mantine/core";
import { useRouter } from "next/router";
import sidebarStyles from "../../styles/account-sidebar.style";
import { memo, ReactElement } from "react";
import { IconEdit } from "@tabler/icons";
import useCurrency from "../../hooks/useCurrency";

type AccountSidebarProps = {
  account: Account;
};

const AccountSidebar = ({ account }: AccountSidebarProps) => {
  const router = useRouter();
  const { cx, classes } = sidebarStyles();
  const { printedAmount } = useCurrency(account.balance, new Date(), account.currency);

  const currentAccountInPath = router.asPath.split("/")[3];

  return (
    <Text<"a">
      component="a"
      className={cx(classes.collapsible, { [classes.linkActive]: account?._id === currentAccountInPath })}
      href={`/shell/account/${account?._id}`}
      key={account?._id}
      onClick={(event) => {
        event.preventDefault();
        void router.push(`/shell/account/${account?._id}`);
      }}
    >
      <Box sx={() => ({ overflow: "hidden", maxWidth: 180 })}>{account?.name}</Box>
      <Box>{printedAmount}</Box>
    </Text>
  );
};

export default memo(AccountSidebar);
