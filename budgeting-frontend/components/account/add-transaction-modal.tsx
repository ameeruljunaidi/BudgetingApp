import { useMutation } from "@apollo/client";
import { Button, createStyles, Group, LoadingOverlay, Select, Stack, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { FormErrors, useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { ContextModalProps } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconX } from "@tabler/icons";
import { FormEvent, useContext, useState } from "react";
import ADD_TRANSACTION from "../../graphql/mutations/add-transaction";
import GET_ME from "../../graphql/queries/get-me";
import GET_TRANSACTIONS_FROM_ACCOUNT from "../../graphql/queries/get-transactions-from-account";
import { Account, AddTransactionDetailInput, AddTransactionInput } from "../../graphql/__generated__/graphql";
import { UserContext } from "../../layouts/shell";

export type AddTransactionModalProps = {
  account: Account;
};

type AddTransactionModalInput = Pick<AddTransactionInput, "date"> &
  Pick<AddTransactionDetailInput, "amount" | "category" | "payee"> & { categoryGroup: string };

const useStyles = createStyles((theme) => ({
  selected: {
    color: `${theme.white} !important`,
    backgroundColor: `${theme.black} !important`,
  },
}));

type SelectType = {
  value: string;
  label: string;
};

export default function AddTransactionModal({ context, id, innerProps }: ContextModalProps<AddTransactionModalProps>) {
  const user = useContext(UserContext);
  if (!user) throw new Error("User must be logged in");

  const { account } = innerProps;

  const { classes, cx } = useStyles();

  const availableCategoryGroups = user.categoryGroups.map((group) => ({
    value: group.categoryGroup,
    label: group.categoryGroup,
  }));
  const initialSelectedCategoryGroup = user.categoryGroups[0].categoryGroup;
  const initialAvailableCategories = user.categoryGroups[0].categories.map((category) => ({
    value: category,
    label: category,
  }));
  const initialAvailablePayees = user.payees.map((payee) => ({ value: payee, label: payee }));

  const [selectedCategoryGroup, setSelectedCategoryGroup] = useState<string>(initialSelectedCategoryGroup);
  const [availableCategories, setAvailableCategories] = useState<SelectType[]>(initialAvailableCategories);
  const [availablePayees, setPayees] = useState<SelectType[]>(initialAvailablePayees);

  const [addTransactionMutation, { loading }] = useMutation(ADD_TRANSACTION);

  const [flow, toggleFlow] = useToggle(["outflow", "inflow"] as const);

  const form = useForm<AddTransactionModalInput>({
    initialValues: {
      date: new Date(),
      amount: 0.0,
      categoryGroup: selectedCategoryGroup,
      category: initialAvailableCategories[0].value,
      payee: availablePayees[0].value,
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

    // prettier-ignore
    const parsedAmount = !values.amount ? 0
            : isNaN(values.amount) ? 0
                : typeof values.amount === "string" ? parseFloat(values.amount)
                    : values.amount;

    const amountWithFlow =
      (flow === "inflow" && parsedAmount < 0) || (flow === "outflow" && parsedAmount > 0)
        ? -parsedAmount
        : parsedAmount;

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
          amount: amountWithFlow,
          category: values.category,
          payee: values.payee,
        },
      ],
    };

    addTransactionMutation({
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

  const handleCategoryGroupChange = (newCategoryGroup: string) => {
    setSelectedCategoryGroup(newCategoryGroup);

    const newCategoryGroupFromUser = user.categoryGroups.find((group) => group.categoryGroup === newCategoryGroup);
    if (!newCategoryGroupFromUser) throw new Error("Failed to find category group");

    const newAvailableCategories = newCategoryGroupFromUser.categories.map((category) => ({
      value: category,
      label: category,
    }));

    form.setFieldValue("category", "");
    setAvailableCategories(newAvailableCategories);
  };

  return (
    <>
      <LoadingOverlay visible={loading} overlayBlur={2} />
      <form onSubmit={form.onSubmit(addTransaction, validateInfo)}>
        <Stack spacing="xs">
          {/* Date */}
          <DatePicker
            value={form.values.date}
            onChange={(value) => form.setFieldValue("date", value)}
            placeholder="Pick a date"
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
            placeholder="Choose A Payee"
            data={availablePayees.filter((payee) => payee.value !== "Reconciler")}
            {...form.getInputProps("payee")}
            nothingFound="Nothing found"
            searchable
            creatable
            getCreateLabel={(query) => `+ Create ${query}`}
            onCreate={(query) => {
              const item = { value: query, label: query };
              setPayees((current) => [...current, item]);
              return item;
            }}
          />

          {/* Category Group */}
          <Select
            label="Category Group"
            placeholder="Choose A Category Group"
            data={availableCategoryGroups.filter((group) => group.value !== "Reconciler")}
            value={selectedCategoryGroup}
            onChange={handleCategoryGroupChange}
          />

          {/* Category */}
          <Select
            label="Category"
            placeholder="Choose A Category"
            data={availableCategories.filter((category) => category.value !== "Reconciler")}
            {...form.getInputProps("category")}
          />

          {/* Amount */}
          <Group position="apart" grow align="flex-end">
            <TextInput type="number" label={`Amount (${account.currency})`} {...form.getInputProps("amount")} />
            <Button onClick={() => toggleFlow()} color={flow === "inflow" ? "blue" : "red"}>
              {flow === "inflow" ? "Inflow" : "Outflow"}
            </Button>
          </Group>

          <Button bg="black" type="submit">
            Submit
          </Button>
        </Stack>
      </form>
    </>
  );
}
