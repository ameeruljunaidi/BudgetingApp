import { Group, Paper, Button, TextInput, Flex, Text } from "@mantine/core";
import { useRef } from "react";
import AddTransactionModal, { AddTransactionModalHandler } from "./add-transaction-modal";

type TransactionsHeaderProps = {
  accountId: string;
};
export default function TransactionsHeader({ accountId }: TransactionsHeaderProps) {
  const transactionHeaderRef = useRef<AddTransactionModalHandler>(null);

  return (
    <Paper bg="white" px="xs" py={8} withBorder>
      <Group position="apart">
        <AddTransactionModal ref={transactionHeaderRef} accountId={accountId}>
          <Button onClick={() => transactionHeaderRef.current?.toggleOpen()} bg="black">
            Add Transaction
          </Button>
        </AddTransactionModal>
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
