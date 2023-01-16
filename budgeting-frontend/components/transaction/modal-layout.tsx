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
import { FormErrors, UseFormReturnType } from "@mantine/form";
import { IconCirclePlus } from "@tabler/icons";
import { FormEvent, useState } from "react";
import { useToggle } from "@mantine/hooks";
import { Account, Scalars, User } from "../../graphql/__generated__/graphql";

const useStyles = createStyles((theme) => ({
  selected: {
    color: `${theme.white} !important`,
    backgroundColor: `${theme.black} !important`,
  },
}));

type TransactionModalLayoutProps<T> = {
  loading: boolean;
  form: UseFormReturnType<T, (values: T) => T>;
  submitHandler: (values: T, _event: FormEvent<HTMLFormElement>) => void;
  validateInfo: (validationErrors: FormErrors, _values: T, _event: FormEvent<HTMLFormElement>) => void;
  account: Account;
  user: User;
  onDateChange: (value: Date | null) => void;
};

type SelectPayee = {
  value: string;
  label: string;
};

type SelectCategory = {
  value: string;
  label: string;
  group: string;
};

export type TransactionModalInputBase = {
  date: Scalars["DateTime"];
};

const ModalLayout = <T extends TransactionModalInputBase>({
  loading,
  form,
  submitHandler,
  validateInfo,
  account,
  user,
  onDateChange,
}: TransactionModalLayoutProps<T>) => {
  const { classes, cx } = useStyles();
  const [flow, toggleFlow] = useToggle(["outflow", "inflow"] as const);
  const [payees, setPayees] = useState<SelectPayee[]>(user.payees.map((payee) => ({ value: payee, label: payee })));
  const [categories, setCategories] = useState<SelectCategory[]>(
    user.categoryGroups.flatMap((group) =>
      group.categories.map((category) => ({ value: category, label: category, group: group.categoryGroup }))
    )
  );

  return (
    <>
      <LoadingOverlay visible={loading} overlayBlur={2} />
      <form onSubmit={form.onSubmit(submitHandler, validateInfo)}>
        <Flex justify="space-between" align="flex-end" wrap="nowrap" gap="sm">
          <DatePicker
            value={form.values.date}
            onChange={onDateChange}
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
};

export default ModalLayout;
