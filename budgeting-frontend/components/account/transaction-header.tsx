import { Group, Paper, Button, TextInput, Flex, Text } from "@mantine/core";
import { openContextModal } from "@mantine/modals";

type TransactionsHeaderProps = {
  accountId: string;
};
export default function TransactionsHeader({ accountId }: TransactionsHeaderProps) {
  const handleAddTransaction = (accountId: string) => {
    openContextModal({
      modal: "addTransaction",
      title: "Add Transaction",
      innerProps: { accountId },
    });
  };

  return (
    <Paper bg="white" px="xs" py={8} withBorder>
      <Group position="apart">
        <Button onClick={() => handleAddTransaction(accountId)} bg="black">
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
