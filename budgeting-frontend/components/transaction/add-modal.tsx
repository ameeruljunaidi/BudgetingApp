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

type SelectPayee = {
  value: string;
  label: string;
};

type SelectCategory = {
  value: string;
  label: string;
  group: string;
};

export default function AddModal({ context, id, innerProps }: ContextModalProps<AddTransactionModalProps>) {
  const user = useContext(UserContext);
  if (!user) throw new Error("User must be logged in");
  const { account } = innerProps;
  const { classes, cx } = useStyles();
  const [flow, toggleFlow] = useToggle(["outflow", "inflow"] as const);
  const [addTransactionMutation, { loading }] = useMutation(ADD_TRANSACTION);
  const [payees, setPayees] = useState<SelectPayee[]>(user.payees.map((payee) => ({ value: payee, label: payee })));
  const [categories, setCategories] = useState<SelectCategory[]>(
    user.categoryGroups.flatMap((group) =>
      group.categories.map((category) => ({ value: category, label: category, group: group.categoryGroup }))
    )
  );

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

    // prettier-ignore
    const parsedAmount = !values.amount || isNaN(values.amount) ? 0 : values.amount; // ! TODO: Might need to fix this

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
    <>
      <LoadingOverlay visible={loading} overlayBlur={2} />
      <form onSubmit={form.onSubmit(addTransaction, validateInfo)}>
        <Flex justify="space-between" align="flex-end" wrap="nowrap" gap="sm">
          <DatePicker
            value={form.values.date}
            onChange={(value) => form.setFieldValue("date", value)}
            placeholder="Pick a date"
            label="Date"
            firstDayOfWeek="sunday"
            dayClassName={(date, modifiers) =>
              cx({
                [classes.selected]: modifiers.selected,
              })
            }
          />
          <Select
            {...form.getInputProps("payee")}
            label="Payee"
            placeholder="Choose or add."
            data={payees.filter((payee) => payee.value !== "Reconciler")}
            clearable
            allowDeselect
            nothingFound="Nothing found. Try adding one."
            searchable
            creatable
            getCreateLabel={(query) => `+ Create ${query}`}
            onCreate={(query) => {
              const item = { value: query, label: query };
              setPayees((current) => [...current, item]);
              return item;
            }}
          />
          <Group spacing="xs" align="flex-end" noWrap>
            <Select
              {...form.getInputProps("category")}
              label="Category"
              placeholder="Choose or add."
              data={categories.filter((category) => category.value !== "Reconciler")}
              clearable
              allowDeselect
              searchable
              nothingFound="Nothing found."
              getCreateLabel={(query) => `+ Create ${query}`}
            />
            <Tooltip label="Add a category group/category.">
              <ActionIcon mb={4}>
                <IconCirclePlus />
              </ActionIcon>
            </Tooltip>
          </Group>
          <Group position="apart" grow align="flex-end" noWrap>
            <NumberInput
              {...form.getInputProps("amount")}
              type="number"
              label={`Amount (${account.currency})`}
              defaultValue={0}
              hideControls
            />
            <Button onClick={() => toggleFlow()} color={flow === "inflow" ? "blue" : "red"} w={0} type="button">
              {flow === "inflow" ? "Inflow" : "Outflow"}
            </Button>
          </Group>
          <Button bg="black" type="submit">
            Submit
          </Button>
        </Flex>
      </form>
    </>
  );
}
