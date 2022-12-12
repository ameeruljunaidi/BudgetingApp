import usersData from "./testData/users.data.json";
import testUtils from "./testUtils/testUtils";
import AddAccountInput from "../schema/account/addAccount.input";
import User, { UserModel } from "../schema/user.schema";
import assert from "assert";
import path from "path";

import pinoLogger from "../utils/logger";

const logger = pinoLogger(path.basename(__filename));
export const CreateUserWithId = `#graphql
    mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
            _id
            name
            email
            role
        }
    }
`;

export const AddAccount = `#graphql
    mutation AddAccount($input: AddAccountInput!) {
        addAccount(input: $input) {
            user
            name
            currency
            transactions
            active
        }
    }
`;

const userFromData = usersData[0];
let userId: string;
let user: User;

describe("Account basic functions", () => {
    beforeEach(async () => {
        // TODO: Update account
        // await AccountModel.deleteMany({});
        await UserModel.deleteMany({});

        const userResponse = await testUtils.testServer().executeOperation({
            query: CreateUserWithId,
            variables: { input: userFromData },
        });

        assert(userResponse.body.kind === "single");
        const userAdded: User = userResponse.body.singleResult.data?.createUser as User;

        userId = userAdded._id;
        user = (await UserModel.findById(userAdded._id).lean()) as User;
    });

    it("can add an account", async () => {
        const variables = { input: { name: "Tom Cruise's Account", currency: "USD" } as AddAccountInput };

        const accountResponse = await testUtils
            .testServer()
            .executeOperation({ query: AddAccount, variables }, { contextValue: { user } });

        assert(accountResponse.body.kind === "single");
        expect(accountResponse.body.singleResult.errors).toBeUndefined();
        expect(accountResponse.body.singleResult.data?.addAccount).toEqual({
            name: "Tom Cruise's Account",
            currency: "USD",
            active: true,
            transactions: [],
            user: userId,
        });
    });
});
