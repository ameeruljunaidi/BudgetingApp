import { Button, Flex, Group, Paper, Text, TextInput } from "@mantine/core";
import { openContextModal } from "@mantine/modals";
import { Account } from "../../graphql/__generated__/graphql";

type TransactionsHeaderProps = {
  account: Account;
};
export default function TransactionsHeader({ account }: TransactionsHeaderProps) {
  const handleAddTransaction = (account: Account) => {
    openContextModal({
      modal: "addTransaction",
      title: "Add Transaction",
      innerProps: { account },
    });
  };

  return (
    <Paper bg="white" px="xs" py={8} withBorder>
      <Group position="apart">
        <Button onClick={() => handleAddTransaction(account)} bg="black">
          Add Transaction
        </Button>
        <div>
          <Flex direction="row" justify="flex-end" align="center">
            <Text mr="xs">Filter:</Text>
            <form>
              <TextInput w={320} placeholder="In Progress" />
            </form>
          </Flex>
        </div>
      </Group>
    </Paper>
  );
}
