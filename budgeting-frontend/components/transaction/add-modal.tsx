import { useMutation } from "@apollo/client";
import {
  ActionIcon,
  Button,
  createStyles,
  Flex,
  Group,
  LoadingOverlay,
  NumberInput,
  Select,
  Tooltip,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { FormErrors, useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { ContextModalProps } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconCirclePlus, IconX } from "@tabler/icons";
import { FormEvent, useContext, useState } from "react";
import ADD_TRANSACTION from "../../graphql/mutations/add-transaction";
import GET_ME from "../../graphql/queries/get-me";
import GET_TRANSACTIONS_FROM_ACCOUNT from "../../graphql/queries/get-transactions-from-account";
import { Account, AddTransactionDetailInput, AddTransactionInput } from "../../graphql/__generated__/graphql";
import { UserContext } from "../../layouts/shell";
import TransactionModalLayout, { TransactionModalInputBase } from "./modal-layout";

export type AddTransactionModalProps = {
  account: Account;
};

type AddTransactionModalInput = TransactionModalInputBase &
  Pick<AddTransactionDetailInput, "amount" | "category" | "payee"> & { categoryGroup: string };

export default function AddModal({ context, id, innerProps }: ContextModalProps<AddTransactionModalProps>) {
  const user = useContext(UserContext);
  if (!user) throw new Error("User must be logged in");
  const { account } = innerProps;
  const [addTransactionMutation, { loading }] = useMutation(ADD_TRANSACTION);

  const form = useForm<AddTransactionModalInput>({
    initialValues: {
      date: new Date(),
      amount: 0.0,
      categoryGroup: "",
      category: "",
      payee: "",
    },
    validate: {
      amount: (value) =>
        value === undefined ? "Must have an amount" : isNaN(value) ? "Amount must be a number" : null,
      // categoryGroup: , // TODO: Validate
      // category: , // TODO: Validate
    },
  });

  const addTransaction = (values: AddTransactionModalInput, _event: FormEvent<HTMLFormElement>) => {
    if (!account) {
      form.reset();
      context.closeModal(id);
      showNotification({
        title: "Failed to add transaction.",
        message: "Could not find account.",
        color: "red",
        icon: <IconX />,
      });
      return;
    }

    const newTransaction: AddTransactionInput = {
      date: values.date,
      account: account.name ?? "",
      approved: true,
      currency: account.currency ?? "CAD",
      reconciled: false,
      scheduled: false,
      cleared: false,
      transactionDetails: [
        {
          amount: values.amount,
          category: values.category,
          payee: values.payee,
        },
      ],
    };

    void addTransactionMutation({
      variables: { input: newTransaction },
      refetchQueries: [
        { query: GET_TRANSACTIONS_FROM_ACCOUNT, variables: { accountId: account._id } },
        { query: GET_ME },
      ],
      onCompleted: (_data) => {
        showNotification({ title: "Added transaction", message: "Successfully added transaction to account" });
      },
      onError: (error) => {
        showNotification({
          title: "Failed to add transaction.",
          message: `${error.graphQLErrors[0].message}`,
          color: "red",
          icon: <IconX />,
        });
      },
    });

    form.reset();
    context.closeModal(id);
  };

  const validateInfo = (
    validationErrors: FormErrors,
    _values: AddTransactionModalInput,
    _event: FormEvent<HTMLFormElement>
  ) => {
    console.log(validationErrors);
  };

  return (
    <TransactionModalLayout
      loading={loading}
      form={form}
      submitHandler={addTransaction}
      validateInfo={validateInfo}
      account={account}
      user={user}
      onDateChange={(value) => form.setFieldValue("date", value)}
    />
  );
}
