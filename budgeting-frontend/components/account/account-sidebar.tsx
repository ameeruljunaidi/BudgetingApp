import { Account } from "../../graphql/__generated__/graphql";
import { Box, Group, Text } from "@mantine/core";
import { useRouter } from "next/router";
import sidebarStyles from "../../styles/account-sidebar.style";

type AccountSidebarProps = {
  account: Account;
};

export default function AccountSidebar({ account }: AccountSidebarProps) {
  const router = useRouter();
  const { cx, classes } = sidebarStyles();

  const currentAccountInPath = router.asPath.split("/")[3];

  return (
    <Text<"a">
      component="a"
      className={cx(classes.collapsible, { [classes.linkActive]: account?._id === currentAccountInPath })}
      href={`/shell/account/${account?._id}`}
      key={account?._id}
      onClick={(event) => {
        event.preventDefault();
        router.push(`/shell/account/${account?._id}`);
      }}
    >
      <Group spacing={0} position="apart">
        <Box>{account?.name}</Box>
        <Box>{account?.balance.toLocaleString("en-US", { style: "currency", currency: "USD" })}</Box>
      </Group>
    </Text>
  );
}
