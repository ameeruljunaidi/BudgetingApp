import { FormEvent, forwardRef, ReactElement, useEffect, useImperativeHandle, useState } from "react";
import { Button, Center, Container, Loader, Modal, Select, Stack, TextInput } from "@mantine/core";
import { FormErrors, useForm } from "@mantine/form";
import { AddAccountInput } from "../graphql/__generated__/graphql";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import ADD_ACCOUNT from "../graphql/mutations/add-account";
import GET_ME from "../graphql/queries/get-me";
import { showNotification } from "@mantine/notifications";

export type AddAccountModalHandler = {
    toggleOpen: () => void;
};

type AddAccountModalProps = {
    children: ReactElement;
};

const AddAccountModal = forwardRef<AddAccountModalHandler, AddAccountModalProps>(({ children }, refs) => {
    const [opened, setOpened] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [addAccountMutation, { data, loading, error }] = useMutation(ADD_ACCOUNT);
    const router = useRouter();

    useEffect(() => {
        setIsLoading(loading);
    }, [loading]);

    const form = useForm({
        initialValues: {
            name: "",
            type: "checking",
            balance: 0,
        },
        validate: {
            name: value => (value.length < 3 ? "Account name must be longer than 3 characters" : null),
            type: value => (!accountTypes.find(item => item === value) ? "Invalid type of account" : null),
            balance: value => (isNaN(value) ? "Balance must be a number" : null),
        },
    });

    const toggleOpen = () => {
        setOpened(prev => !prev);
    };

    useImperativeHandle(refs, () => ({
        toggleOpen,
    }));

    const accountTypes = ["checking", "credit", "tracking"];

    const selections = accountTypes.map(item => ({
        value: item,
        label: item
            .split(" ")
            .map(word => word[0].toUpperCase() + word.substring(1))
            .join(""),
    }));

    const addAccount = (values: AddAccountInput, _event: FormEvent<HTMLFormElement>) => {
        // prettier-ignore
        const parsedBalance = !values.balance ? 0
            : isNaN(values.balance) ? 0
            : typeof values.balance === "string" ? parseInt(values.balance)
            : values.balance;

        addAccountMutation({
            variables: {
                input: { name: values.name, type: values.type, balance: parsedBalance },
            },
            onCompleted: data => {
                showNotification({
                    title: "Successfully added account",
                    message: `${data.addAccount.name} added!`,
                });
                setOpened(prev => !prev);
                form.reset();
            },
            onError: error => console.error(error.graphQLErrors[0].message),
            refetchQueries: [{ query: GET_ME }],
        });

        router.push("/shell/accounts");
    };

    const validateInfo = (
        validationErrors: FormErrors,
        _values: AddAccountInput,
        _event: FormEvent<HTMLFormElement>
    ) => {
        console.log(validationErrors);
    };

    return (
        <>
            {children}
            <Modal opened={opened} onClose={() => setOpened(false)} title="Add an Account" centered>
                {isLoading ? (
                    <Center>
                        <Loader />
                    </Center>
                ) : (
                    <form onSubmit={form.onSubmit(addAccount, validateInfo)}>
                        <Stack>
                            {/* Name */}
                            <TextInput
                                type="text"
                                placeholder="Name of Your Account"
                                label="Account Name"
                                {...form.getInputProps("name")}
                            />

                            {/* Type */}
                            <Select
                                label="Account Type"
                                placeholder="Choose Account Type"
                                data={selections}
                                {...form.getInputProps("type")}
                            />

                            {/* Balance */}
                            <TextInput type="number" label="Account Balance" {...form.getInputProps("balance")} />

                            {/* Submit Button */}
                            <Button bg="black" type="submit">
                                Submit
                            </Button>
                        </Stack>
                    </form>
                )}
            </Modal>
        </>
    );
});

AddAccountModal.displayName = "AddAccountModal";

export default AddAccountModal;
