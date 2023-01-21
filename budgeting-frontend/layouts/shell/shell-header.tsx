import { Burger, Flex, Group, Header, MediaQuery, NativeSelect, Select, Text, useMantineTheme } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { IconCash, IconCashBanknote } from "@tabler/icons";
import { Dispatch, SetStateAction } from "react";
import rates from "../../utils/rates";
import Link from "next/link";

type ShellHeaderProps = {
  sidebarOpened: boolean;
  setSidebarOpened: Dispatch<SetStateAction<boolean>>;
  selectedCurrency: string;
  setSelectedCurrency: Dispatch<SetStateAction<string>>;
};

export default function ShellHeader({
  sidebarOpened,
  setSidebarOpened,
  selectedCurrency,
  setSelectedCurrency,
}: ShellHeaderProps) {
  const theme = useMantineTheme();
  const { width } = useViewportSize();

  return (
    <Header height={{ base: 50, md: 70 }} p="md" bg="black">
      <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            opened={sidebarOpened}
            onClick={() => setSidebarOpened((o) => !o)}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>

        <Group position="apart" w={width}>
          <Link href="/">
            <Group position="left">
              <IconCash color="white" size={46} />
              <Text color="white" weight={700}>
                Budgeting App
              </Text>
            </Group>
          </Link>
          <Flex align="center" columnGap={10}>
            <Text color="white">Global Currency</Text>
            <Select
              maw={80}
              searchable
              data={rates}
              value={selectedCurrency}
              onChange={(value) => {
                let currency = "CAD";
                if (value) currency = value;
                setSelectedCurrency(currency);
                if (typeof window !== "undefined") localStorage.setItem("globalCurrency", currency);
              }}
            />
          </Flex>
        </Group>
      </div>
    </Header>
  );
}
