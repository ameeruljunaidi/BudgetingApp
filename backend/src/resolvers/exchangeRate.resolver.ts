import { Arg, Authorized, Query, Resolver } from "type-graphql";
import ConvertCurrencyInput from "../schema/exchangeRate/convertCurrency.input";
import ExchangeRateService from "../service/exchangeRate.service";

@Resolver()
export default class ExchangeRateResolver {
    constructor(private exchangeRateService: ExchangeRateService) {
        this.exchangeRateService = new ExchangeRateService();
    }

    @Authorized("admin", "user", "guest")
    @Query(() => Number)
    convertCurrency(@Arg("input") input: ConvertCurrencyInput) {
        return this.exchangeRateService.convertCurrency(input);
    }
}
