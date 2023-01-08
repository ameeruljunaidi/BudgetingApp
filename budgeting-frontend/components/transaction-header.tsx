import { Group, Paper, Button, TextInput, Flex, Text } from "@mantine/core";

type TransactionsHeaderProps = {
    accountId: string;
};
export default function TransactionsHeader({ accountId }: TransactionsHeaderProps) {
    return (
        <Paper bg="white" px="xs" py={8} withBorder>
            <Group position="apart">
                <Button bg="black">Add Transaction</Button>
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
