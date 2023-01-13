import { useCallback, useContext, useEffect, useState } from "react";
import { Account } from "../graphql/__generated__/graphql";
import { CurrencyContext } from "../layouts/shell";
import { useQuery } from "@apollo/client";
import CONVERT_CURRENCY from "../graphql/mutations/convert-currency";

export default function useCurrency(
  amount: number,
  rawDate: Date,
  accountCurrency: Account["currency"]
): { printedAmount: string; transactionAmount: number; flow: string } {
  const [transactionAmount, setTransactionAmount] = useState<number>(0);
  const [printedAmount, setPrintedAmount] = useState<string>("");

  const globalCurrency = useContext(CurrencyContext);

  const year = rawDate.toLocaleString("default", { year: "numeric" });
  const month = rawDate.toLocaleString("default", { month: "2-digit" });
  const day = rawDate.toLocaleString("default", { day: "2-digit" });
  const date = year + "-" + month + "-" + day;

  const { data, loading, error } = useQuery(CONVERT_CURRENCY, {
    variables: { input: { amount: 1, from: accountCurrency, to: globalCurrency, date } },
  });

  const formatCurrency = useCallback(
    (amount: number): string => {
      const flow = amount < 0 ? "outflow" : "inflow";

      const amountText = `${flow === "outflow" ? "(" : ""}${Math.abs(amount).toLocaleString("en-US", {
        style: "currency",
        currency: `${globalCurrency}`,
      })}${flow === "outflow" ? ")" : ""}`;

      return amountText;
    },
    [globalCurrency]
  );

  useEffect(() => {
    if (loading) {
      setPrintedAmount("Loading...");
    } else if (error || !data) {
      console.log("Error:", error?.graphQLErrors[0].message);
      setPrintedAmount("Error");
    } else {
      const finalAmount = amount * data.convertCurrency.result;
      setPrintedAmount(formatCurrency(finalAmount));
      setTransactionAmount(finalAmount);
    }
  }, [data, loading, error, amount, formatCurrency]);

  const flow = amount < 0 ? "outflow" : "inflow";

  return { printedAmount, transactionAmount, flow };
}
