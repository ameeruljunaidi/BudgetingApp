import { useQuery } from "@apollo/client";
import { Center, Container, Loader, Paper, Text } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { useRouter } from "next/router";
import { ReactElement, useContext } from "react";
import Shell from "../../../layouts/shell";
import GET_TRANSACTIONS_FROM_ACCOUNT from "../../../graphql/queries/get-transactions-from-account";
import type { NextPageWithLayout } from "../../_app";
import { UserContext } from "../../../layouts/shell";
import TransactionsTable from "../../../components/transactions-table";
import { Transaction } from "../../../graphql/__generated__/graphql";

const AccountPage: NextPageWithLayout = () => {
    const router = useRouter();
    const accountId = router.query.id as string;
    const { height, width } = useViewportSize();
    const user = useContext(UserContext);

    const { data, loading, error } = useQuery(GET_TRANSACTIONS_FROM_ACCOUNT, {
        variables: { accountId },
        skip: !accountId,
    });

    if (!user) {
        return (
            <Center h={height} w={width}>
                <Text>User not found</Text>
            </Center>
        );
    }

    const account = user.accounts.find(account => account?._id === accountId);

    if (loading) {
        return (
            <Center h={height} w={width}>
                <Loader />
            </Center>
        );
    }

    if (error) {
        return (
            <Center h={height} w={width}>
                <Text>Account not found. {error.graphQLErrors[0].message}</Text>
            </Center>
        );
    }

    const transactions: Transaction[] = data?.getTransactionsFromAccount ?? [];

    return (
        <Container>
            <Paper h={height * 0.1} w={460} bg="white" p="xs" withBorder radius="lg">
                <Text size="sm">Name: {account?.name}</Text>
                <Text size="sm">Currency: {account?.currency}</Text>
                <Text size="sm">Balance: {account?.balance}</Text>
            </Paper>
            <TransactionsTable transactions={transactions} />
        </Container>
    );
};

AccountPage.getLayout = function getLayout(page: ReactElement) {
    return <Shell>{page}</Shell>;
};

export default AccountPage;
