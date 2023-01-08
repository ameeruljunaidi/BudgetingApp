import { useMutation } from "@apollo/client";
import { Button, Center, createStyles, Loader, Modal, Select, Stack, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { FormErrors, useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconX } from "@tabler/icons";
import { FormEvent, forwardRef, ReactElement, useContext, useImperativeHandle, useState } from "react";
import ADD_TRANSACTION from "../graphql/mutations/add-transaction";
import GET_ME from "../graphql/queries/get-me";
import GET_TRANSACTIONS_FROM_ACCOUNT from "../graphql/queries/get-transactions-from-account";
import { AddTransactionDetailInput, AddTransactionInput } from "../graphql/__generated__/graphql";
import { UserContext } from "../layouts/shell";

export type AddTransactionModalHandler = {
  toggleOpen: () => void;
};

export type AddTransactionModalProps = {
  children: ReactElement;
  accountId: string;
};

type AddTransactionModalInput = Pick<AddTransactionInput, "date"> &
  Pick<AddTransactionDetailInput, "amount" | "category" | "categoryGroup" | "payee">;

const useStyles = createStyles(theme => ({
  weekend: {
    color: `${theme.black} !important`,
  },

  selected: {
    color: `${theme.white} !important`,
    backgroundColor: `${theme.black} !important`,
  },
}));

const AddTransactionModal = forwardRef<AddTransactionModalHandler, AddTransactionModalProps>(
  ({ children, accountId }, refs) => {
    const [opened, setOpened] = useState(false);
    const [addTransactionMutation, { loading }] = useMutation(ADD_TRANSACTION);
    const user = useContext(UserContext);
    const { classes, cx } = useStyles();

    const availableCategories = user?.categories.map(value => ({ value, label: value })) ?? [];
    const availableCategoryGroups = user?.categoryGroups.map(value => ({ value, label: value })) ?? [];
    const [availablePayees, setPayees] = useState(user?.payees.map(value => ({ value, label: value })) ?? []);

    const toggleOpen = () => {
      setOpened(o => !o);
    };

    useImperativeHandle(refs, () => ({
      toggleOpen,
    }));

    const form = useForm<AddTransactionModalInput>({
      initialValues: {
        date: new Date(),
        amount: 0,
        category:
          availableCategories && availableCategories.length > 0
            ? availableCategories[0].value
            : "No available categories",
        categoryGroup:
          availableCategoryGroups && availableCategoryGroups.length > 0
            ? availableCategoryGroups[0].value
            : "No available category groups",
        payee:
          availablePayees && availablePayees.length > 0 ? availablePayees[0].value : "No available category groups",
      },
      validate: {
        amount: value =>
          value === undefined ? "Must have an amount" : isNaN(value) ? "Amount must be a number" : null,
        category: value =>
          !!availableCategories?.find(category => category.value === value) ? null : "Invalid category.",
        categoryGroup: value =>
          !!availableCategoryGroups?.find(categoryGroup => categoryGroup.value === value)
            ? null
            : "Invalid category group",
        payee: value => (!!availablePayees?.find(payee => payee.value === value) ? null : "Invalid payee"),
      },
    });

    const addTransaction = (values: AddTransactionModalInput, _event: FormEvent<HTMLFormElement>) => {
      if (!user) {
        form.reset();
        setOpened(o => !o);
        showNotification({
          title: "Failed to add transaction.",
          message: "Could not find user on file.",
          color: "red",
          icon: <IconX />,
        });
        return;
      }

      const account = user.accounts.find(account => account?._id === accountId); // Will throw error if not found

      if (!account) {
        form.reset();
        setOpened(o => !o);
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

      const newTransaction: AddTransactionInput = {
        date: values.date,
        account: account.name ?? "",
        approved: true,
        currency: account.currency ?? "CAD",
        reconciled: false,
        scheduled: false,
        transactionDetails: [
          {
            amount: parsedAmount,
            category: values.category,
            categoryGroup: values.categoryGroup,
            payee: values.payee,
          },
        ],
      };

      addTransactionMutation({
        variables: { input: newTransaction },
        refetchQueries: [{ query: GET_TRANSACTIONS_FROM_ACCOUNT, variables: { accountId } }, { query: GET_ME }],
        onCompleted: _data => {
          showNotification({ title: "Added transaction", message: "Successfully added transaction to account" });
        },
        onError: error => {
          showNotification({
            title: "Failed to add transaction.",
            message: `${error.graphQLErrors[0].message}`,
            color: "red",
            icon: <IconX />,
          });
        },
      });

      form.reset();
      setOpened(o => !o);
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
        {children}
        <Modal opened={opened} onClose={() => setOpened(o => !o)} title="Add a transaction" centered>
          {loading ? (
            <Center>
              <Loader />
            </Center>
          ) : (
            <form onSubmit={form.onSubmit(addTransaction, validateInfo)}>
              <Stack spacing="xs">
                {/* Date */}
                <DatePicker
                  value={form.values.date}
                  onChange={value => form.setFieldValue("date", value)}
                  placeholder="Pick a date"
                  label="Transaction Date"
                  firstDayOfWeek="sunday"
                  dayClassName={(date, modifiers) =>
                    cx({
                      [classes.weekend]: modifiers.weekend,
                      [classes.selected]: modifiers.selected,
                    })
                  }
                />

                {/* Payee */}
                <Select
                  label="Payee"
                  placeholder="Choose A Payee"
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
                  placeholder="Choose A Category Group"
                  data={availableCategoryGroups}
                  {...form.getInputProps("categoryGroup")}
                />

                {/* Category */}
                <Select
                  label="Category"
                  placeholder="Choose A Category"
                  data={availableCategories}
                  {...form.getInputProps("category")}
                />

                {/* Amount */}
                <TextInput type="number" label="Amount" {...form.getInputProps("amount")} />

                <Button bg="black" type="submit">
                  Submit
                </Button>
              </Stack>
            </form>
          )}
        </Modal>
      </>
    );
  }
);

AddTransactionModal.displayName = "AddTransactionModal";

export default AddTransactionModal;
