import { useMutation } from "@apollo/client";
import { Button, Center, createStyles, Loader, Modal, Select, Stack, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { FormErrors, useForm } from "@mantine/form";
import { ContextModalProps } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconX } from "@tabler/icons";
import { FormEvent, forwardRef, ReactElement, useContext, useImperativeHandle, useState } from "react";
import UPDATE_TRANSACTION from "../../graphql/mutations/update-transaction";
import GET_ME from "../../graphql/queries/get-me";
import GET_TRANSACTIONS_FROM_ACCOUNT from "../../graphql/queries/get-transactions-from-account";
import {
  UpdateTransactionInput,
  Transaction,
  AddTransactionDetailInput,
  CategoryGroups,
} from "../../graphql/__generated__/graphql";
import { UserContext } from "../../layouts/shell";

export type EditTransactionModalProps = {
  transaction: Transaction;
};

type EditTransactionModalInput = Pick<UpdateTransactionInput, "date"> &
  Pick<AddTransactionDetailInput, "amount" | "category" | "payee"> & { categoryGroup: string };

const useStyles = createStyles(theme => ({
  selected: {
    color: `${theme.white} !important`,
    backgroundColor: `${theme.black} !important`,
  },
}));

type SelectType = {
  value: string;
  label: string;
};

export default function EditTransactionModal({
  context,
  id,
  innerProps,
}: ContextModalProps<EditTransactionModalProps>) {
  const user = useContext(UserContext);
  if (!user) throw new Error("User must be logged in");

  const { transaction } = innerProps;

  const { classes, cx } = useStyles();

  const categoryGroupFromUser = user.categoryGroups.find(group =>
    group.categories.find(category => category === transaction.transactionDetails[0].category)
  );
  if (!categoryGroupFromUser) throw new Error("Cannot find category group from user");

  const availableCategoryGroups = user.categoryGroups.map(group => ({
    value: group.categoryGroup,
    label: group.categoryGroup,
  }));
  const initialSelectedCategoryGroup = categoryGroupFromUser.categoryGroup;
  const initialAvailableCategories = categoryGroupFromUser.categories.map(category => ({
    value: category,
    label: category,
  }));
  const initialAvailablePayees = user.payees.map(payee => ({ value: payee, label: payee }));

  const [selectedCategoryGroup, setSelectedCategoryGroup] = useState<string>(initialSelectedCategoryGroup);
  const [availableCategories, setAvailableCategories] = useState<SelectType[]>(initialAvailableCategories);
  const [availablePayees, setPayees] = useState<SelectType[]>(initialAvailablePayees);

  const [updateTransactionMutation, { loading }] = useMutation(UPDATE_TRANSACTION);

  const form = useForm<EditTransactionModalInput>({
    initialValues: {
      date: new Date(Date.parse(transaction.date)),
      amount: transaction.transactionDetails[0].amount,
      category: transaction.transactionDetails[0].category,
      categoryGroup: selectedCategoryGroup,
      payee: transaction.transactionDetails[0].payee,
    },
    validate: {
      amount: value => (value === undefined ? "Must have an amount" : isNaN(value) ? "Amount must be a number" : null),
      category: value =>
        !!availableCategories?.find(category => category.value === value) ? null : "Invalid category.",
      categoryGroup: value =>
        !!availableCategoryGroups?.find(categoryGroup => categoryGroup.value === value)
          ? null
          : "Invalid category group",
      payee: value => (!!availablePayees?.find(payee => payee.value === value) ? null : "Invalid payee"),
    },
  });

  const updateTransaction = (values: EditTransactionModalInput, _event: FormEvent<HTMLFormElement>) => {
    if (!user) {
      form.reset();
      context.closeModal(id);
      showNotification({
        title: "Failed to add transaction.",
        message: "Could not find user on file.",
        color: "red",
        icon: <IconX />,
      });
      return;
    }

    const account = user.accounts.find(account => account?._id === transaction.account); // Will throw error if not found

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

    // prettier-ignore
    const parsedAmount = !values.amount ? 0
      : isNaN(values.amount) ? 0
      : typeof values.amount === "string" ? parseInt(values.amount)
      : values.amount;

    const updatedTransaction: UpdateTransactionInput = {
      id: transaction._id,
      date: values.date,
      account: transaction.account,
      approved: true,
      currency: account.currency ?? "CAD",
      reconciled: false,
      scheduled: false,
      cleared: false,
      scheduledDates: transaction.scheduledDates,
      transactionDetails: [
        {
          amount: parsedAmount,
          category: values.category,
          payee: values.payee,
        },
      ],
    };

    updateTransactionMutation({
      variables: { transaction: updatedTransaction },
      refetchQueries: [
        { query: GET_TRANSACTIONS_FROM_ACCOUNT, variables: { accountId: transaction.account } },
        { query: GET_ME },
      ],
      onCompleted: _data => {
        showNotification({ title: "Updated transaction", message: "Successfully updated transaction" });
      },
      onError: error => {
        showNotification({
          title: "Failed to update transaction.",
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
    _values: EditTransactionModalInput,
    _event: FormEvent<HTMLFormElement>
  ) => {
    console.log(validationErrors);
  };

  const handleCategoryGroupChange = (newCategoryGroup: string) => {
    setSelectedCategoryGroup(newCategoryGroup);

    const newCategoryGroupFromUser = user.categoryGroups.find(group => group.categoryGroup === newCategoryGroup);
    if (!newCategoryGroupFromUser) throw new Error("Cannot find category group from user");

    const newAvailableCategories = newCategoryGroupFromUser.categories.map(category => ({
      value: category,
      label: category,
    }));

    form.setFieldValue("category", "");
    setAvailableCategories(newAvailableCategories);
  };

  return (
    <>
      <form onSubmit={form.onSubmit(updateTransaction, validateInfo)}>
        <Stack spacing="xs">
          {/* Date */}
          <DatePicker
            value={form.values.date}
            onChange={value => form.setFieldValue("date", value)}
            label="Transaction Date"
            firstDayOfWeek="sunday"
            dayClassName={(date, modifiers) =>
              cx({
                [classes.selected]: modifiers.selected,
              })
            }
          />

          {/* Payee */}
          <Select
            label="Payee"
            data={availablePayees}
            {...form.getInputProps("payee")}
            nothingFound="Nothing found"
            searchable
            creatable
            getCreateLabel={query => `+ Create ${query}`}
            onCreate={query => {
              const item = { value: query, label: query };
              setPayees(current => [...current, item]);
              return item;
            }}
          />

          {/* Category Group */}
          <Select
            label="Category Group"
            data={availableCategoryGroups}
            value={selectedCategoryGroup}
            onChange={handleCategoryGroupChange}
          />

          {/* Category */}
          <Select
            label="Category"
            data={availableCategories}
            {...form.getInputProps("category")}
            placeholder="Choose A Category"
          />

          {/* Amount */}
          <TextInput type="number" label="Amount" {...form.getInputProps("amount")} />

          <Button bg="black" type="submit">
            Save
          </Button>
        </Stack>
      </form>
    </>
  );
}
