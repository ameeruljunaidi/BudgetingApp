import { FormEvent } from "react";
import { Button, LoadingOverlay, Select, Stack, TextInput } from "@mantine/core";
import { FormErrors, useForm } from "@mantine/form";
import { AddAccountInput } from "../../graphql/__generated__/graphql";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import ADD_ACCOUNT from "../../graphql/mutations/add-account";
import GET_ME from "../../graphql/queries/get-me";
import { showNotification } from "@mantine/notifications";
import { ContextModalProps } from "@mantine/modals";
import { IconX } from "@tabler/icons";

type AddAccountModalProps = {};

const AddAccountModal = ({ context, id }: ContextModalProps<AddAccountModalProps>) => {
  const [addAccountMutation, { loading }] = useMutation(ADD_ACCOUNT);

  const form = useForm({
    initialValues: {
      name: "",
      type: "checking",
      balance: 0,
    },
    validate: {
      name: (value) => (value.length < 3 ? "Account name must be longer than 3 characters" : null),
      type: (value) => (!accountTypes.find((item) => item === value) ? "Invalid type of account" : null),
      balance: (value) => (isNaN(value) ? "Balance must be a number" : null),
    },
  });

  const accountTypes = ["checking", "credit", "tracking"];

  const selections = accountTypes.map((item) => ({
    value: item,
    label: item
      .split(" ")
      .map((word) => word[0].toUpperCase() + word.substring(1))
      .join(""),
  }));

  const addAccount = (values: AddAccountInput, _event: FormEvent<HTMLFormElement>) => {
    const parsedBalance =
      !values.balance || isNaN(values.balance)
        ? 0
        : typeof values.balance === "string"
        ? parseFloat(values.balance)
        : values.balance;

    void addAccountMutation({
      variables: {
        input: { name: values.name, type: values.type, balance: parsedBalance },
      },
      onCompleted: (data) => {
        showNotification({
          title: "Successfully added account",
          message: `${data.addAccount.name} added!`,
        });
        context.closeModal(id);
        // void router.push(`/shell/account/${data.addAccount._id}`);
        form.reset();
      },
      onError: (error) => {
        showNotification({
          title: "Failed to add transaction.",
          message: `${error.graphQLErrors[0].message}`,
          color: "red",
          icon: <IconX />,
        });
        form.reset();
      },
      refetchQueries: [{ query: GET_ME }],
    });
  };

  const validateInfo = (validationErrors: FormErrors, _values: AddAccountInput, _event: FormEvent<HTMLFormElement>) => {
    console.log(validationErrors);
  };

  return (
    <>
      <LoadingOverlay visible={loading} overlayBlur={2} />
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
    </>
  );
};

export default AddAccountModal;
