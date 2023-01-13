import fetch from "node-fetch";
import ExchangeRate, { ExchangeRateModel } from "../schema/exchangeRate.schema";
import ConvertCurrencyInput from "../schema/exchangeRate/convertCurrency.input";
import { ExchangeResponse } from "../types/exchangeResponse";
import path from "path";

import myLogger from "../utils/logger";

const logger = myLogger(path.basename(__filename));

const convertCurrency = async (input: ConvertCurrencyInput): Promise<ExchangeRate> => {
    const { from, to, date, amount }: ConvertCurrencyInput = input;

    const findInDb = await ExchangeRateModel.findOne(input).lean();
    if (findInDb) {
        logger.info("Returning from DB");
        return findInDb;
    }

    logger.info("Result from fetch");

    if (to === from) {
        const result: Omit<ExchangeRate, "_id"> = { ...input, result: amount };
        const returnedRate = await ExchangeRateModel.create(result);
        return returnedRate.toObject();
    }

    const url: string = `https://api.exchangerate.host/convert?from=${from}&to=${to}&date=${date})&amount=${amount}`;
    const response = await fetch(url);
    const data: ExchangeResponse = await response.json();
    const result: Omit<ExchangeRate, "_id"> = { ...input, result: data.result };

    const returnedRate = await ExchangeRateModel.create(result);

    return returnedRate.toObject();
};

export default { convertCurrency };
