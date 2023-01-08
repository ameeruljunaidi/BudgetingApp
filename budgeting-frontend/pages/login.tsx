import { Button, Center, Group, Paper, PasswordInput, Text, TextInput } from "@mantine/core";
import { FormErrors, useForm } from "@mantine/form";
import { FormEvent } from "react";
import { LoginInput } from "../graphql/__generated__/graphql";
import { useViewportSize } from "@mantine/hooks";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Login() {
  const { height, width } = useViewportSize();
  const router = useRouter();

  const form = useForm<LoginInput>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: value => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const logIn = (values: LoginInput, _event: FormEvent<HTMLFormElement>) => {
    // const { email, password } = values;

    // if (email === "tom.cruise@gmail.com" && password === "testpassword") {
    //     console.info("User logged in!");
    //     form.reset();
    // }

    router.push("/shell/home");
  };

  const validateInfo = (validationErrors: FormErrors, _values: LoginInput, _event: FormEvent<HTMLFormElement>) => {
    console.log(validationErrors);
  };

  return (
    <Center h={height} w={width} bg="dark">
      <Paper p="lg" pt="xl" my="xl" w={460} bg="white" h={460} radius="md" withBorder shadow="md">
        <Text p={20} pb={30} ta="center" weight={700} size="xl">
          Budgeting App
        </Text>
        <form onSubmit={form.onSubmit(logIn, validateInfo)} onReset={form.onReset}>
          <TextInput p="xs" pb={0} label="Email" placeholder="your@email.com" {...form.getInputProps("email")} />
          <PasswordInput p="xs" label="Password" placeholder="Your Password" {...form.getInputProps("password")} />
          <Group position="right" mt="md">
            <Button component={Link} href="/shell/home" bg="black">
              Continue
            </Button>
            <Button type="submit" bg="black" mr="xs">
              Submit
            </Button>
          </Group>
        </form>
      </Paper>
    </Center>
  );
}
