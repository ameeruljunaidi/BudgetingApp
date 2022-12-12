import ExchangeRateResolver from "./exchangeRate.resolver";
import TransactionResolver from "./transaction.resolver";
import UserResolver from "./user.resolver";

export default [UserResolver, TransactionResolver, ExchangeRateResolver] as const;
