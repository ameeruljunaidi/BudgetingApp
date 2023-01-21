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
import TransactionModalLayout, { TransactionModalInputBase } from "./transaction-modal-layout";
import { formatMonthLabel } from "@mantine/dates/lib/components/CalendarBase/MonthsList/format-month-label/format-month-label";

export type AddTransactionModalProps = {
  account: Account;
};

export default function AddModal({ context, id, innerProps }: ContextModalProps<AddTransactionModalProps>) {
  const user = useContext(UserContext);
  if (!user) throw new Error("User must be logged in");
  const { account } = innerProps;
  const [addTransactionMutation, { loading }] = useMutation(ADD_TRANSACTION);
  const [flow, toggleFlow] = useToggle(["-", "+"] as const);

  const form = useForm<TransactionModalInputBase>({
    initialValues: {
      date: new Date(),
      amount: "0.00",
      category: "",
      payee: "",
    },
    validate: {
      amount: (value) => {
        const floatValue = parseFloat(value);
        return value === undefined
          ? "Must have an amount"
          : isNaN(floatValue)
          ? "Amount must be a number"
          : floatValue == 0
          ? "Amount must be non-zero"
          : null;
      },
      // category: , // TODO: Validate
    },
  });

  const addTransaction = (values: TransactionModalInputBase, _event: FormEvent<HTMLFormElement>) => {
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
          amount: flow === "-" ? -parseFloat(values.amount) : parseFloat(values.amount),
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
    _values: TransactionModalInputBase,
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
      flow={flow}
      toggleFlow={toggleFlow}
    />
  );
}
