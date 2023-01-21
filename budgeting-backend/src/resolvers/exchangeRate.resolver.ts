import { Arg, Authorized, Query, Resolver } from "type-graphql";
import ExchangeRate from "../schema/exchangeRate.schema";
import ConvertCurrencyInput from "../schema/exchangeRate/convertCurrency.input";
import ExchangeRateService from "../service/exchangeRate.service";

@Resolver()
export default class ExchangeRateResolver {
    @Authorized("admin", "user", "guest")
    @Query(() => ExchangeRate)
    convertCurrency(@Arg("input") input: ConvertCurrencyInput) {
        return ExchangeRateService.convertCurrency(input);
    }
}
