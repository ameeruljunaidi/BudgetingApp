import { useQuery } from "@apollo/client";
import { Center, Container, Header, Loader, MediaQuery, Paper, Text } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import Shell from "../../../components/shell";
import GET_ME from "../../../graphql/queries/get-me";
import type { NextPageWithLayout } from "../../_app";

const AccountPage: NextPageWithLayout = () => {
    const router = useRouter();
    const { id } = router.query;
    const { height, width } = useViewportSize();

    const { data, loading, error } = useQuery(GET_ME);

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
                <Text>User & account not found. {error.graphQLErrors[0].message}</Text>
            </Center>
        );
    }

    const user = data?.me;
    const account = user?.accounts.find(account => account?._id === id);
    const transactions = account?.transactions;
    console.log(account);

    return (
        <Container>
            <Paper h={height * 0.1} w={460} bg="white" p="xs" withBorder radius="lg">
                <Text size="sm">Name: {account?.name}</Text>
                <Text size="sm">Currency: {account?.currency}</Text>
                <Text size="sm">Balance: {account?.balance}</Text>
            </Paper>
        </Container>
    );
};

AccountPage.getLayout = function getLayout(page: ReactElement) {
    return <Shell>{page}</Shell>;
};

export default AccountPage;
