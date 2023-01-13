import { FormEvent, useContext } from "react";
import { Button, LoadingOverlay, Select, Stack, TextInput } from "@mantine/core";
import { FormErrors, useForm } from "@mantine/form";
import { AddAccountInput } from "../../graphql/__generated__/graphql";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import ADD_ACCOUNT from "../../graphql/mutations/add-account";
import GET_ME from "../../graphql/queries/get-me";
import { showNotification } from "@mantine/notifications";
import { ContextModalProps } from "@mantine/modals";
import { CurrencyContext } from "../../layouts/shell";

type AddAccountModalProps = {};

const AddAccountModal = ({ context, id, innerProps }: ContextModalProps<AddAccountModalProps>) => {
  console.log("Add account modal");
  const [addAccountMutation, { data, loading, error }] = useMutation(ADD_ACCOUNT);
  const router = useRouter();

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
        context.closeModal(id);
        router.push(`/shell/account/${data.addAccount._id}`);
        form.reset();
      },
      onError: error => console.error(error.graphQLErrors[0].message),
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

AddAccountModal.displayName = "AddAccountModal";

export default AddAccountModal;
