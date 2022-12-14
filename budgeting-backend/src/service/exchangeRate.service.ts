import fetch from "node-fetch";
import { ExchangeRateModel } from "../schema/exchangeRate.schema";
import ConvertCurrencyInput from "../schema/exchangeRate/convertCurrency.input";
import { ExchangeResponse } from "../types/exchangeResponse";
import path from "path";

import myLogger from "../utils/logger";

const logger = myLogger(path.basename(__filename));

const convertCurrency = async (input: ConvertCurrencyInput): Promise<Number> => {
    const { from, to, date, amount }: ConvertCurrencyInput = input;
    const findInDb = await ExchangeRateModel.findOne(input).lean();
    if (findInDb) {
        logger.info("Returning from DB");
        return findInDb.storedResult;
    }

    const url: string = `https://api.exchangerate.host/convert?from=${from}&to=${to}&date=${date})&amount=${amount}`;
    const response = await fetch(url);
    const data: ExchangeResponse = await response.json();
    const result = data.result;

    await ExchangeRateModel.create({ ...input, storedResult: result });

    logger.info("Result from fetch");
    return data.result;
};

export default { convertCurrency };
