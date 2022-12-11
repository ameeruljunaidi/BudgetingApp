import AccountResolver from "./account.resolver";
import ExchangeRateResolver from "./exchangeRate.resolver";
import TransactionResolver from "./transaction.resolver";
import UserResolver from "./user.resolver";
import CategoryResolver from "./category.resolver";
import SubCategoryResolver from "./subCategory.resolver";

export default [
    UserResolver,
    TransactionResolver,
    AccountResolver,
    ExchangeRateResolver,
    CategoryResolver,
    SubCategoryResolver,
] as const;
