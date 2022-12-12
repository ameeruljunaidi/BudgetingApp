import usersData from "./testData/users.data.json";
import User, { UserModel } from "../schema/user.schema";
import testUtils from "./testUtils/testUtils";
import LoginInput from "../schema/user/login.input";
import { GraphQLResponse } from "@apollo/server";
import assert from "assert";
import path from "path";

import pinoLogger from "../utils/logger";

const logger = pinoLogger(path.basename(__filename));

const usersInfo = usersData.map((user) => {
    const { password, ...userInfo } = user;
    return userInfo;
});

export const CreateUser = `#graphql
    mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
            name
            email
            role
        }
    }
`;

export const GetUsers = `#graphql
    query GetUsers {
        getUsers {
            name
            role
            email
        }
    }
`;

export const DeleteUser = `#graphql
    mutation DeleteUser {
        deleteUser {
            name
            email
            role
        }
    }
`;

export const Login = `#graphql
    mutation Login($input: LoginInput!) {
        login(input: $input)
    }
`;

describe("User basic functions", () => {
    beforeEach(async () => {
        await UserModel.deleteMany({});
    });

    it("can add a single user", async () => {
        const user = usersData[0];
        const { password, ...userInfo } = user;

        const variables = { input: user };

        const response = await testUtils.testServer().executeOperation({ query: CreateUser, variables });

        assert(response.body.kind === "single");
        expect(response.body.singleResult.errors).toBeUndefined();
        expect(response.body.singleResult.data?.createUser).toEqual(userInfo);
    });

    it("can add multiple user", async () => {
        const responsePromises = usersData
            .map((user) => ({ input: user }))
            .map((variables) => testUtils.testServer().executeOperation({ query: CreateUser, variables }));
        const responses = await Promise.all(responsePromises);

        expect(responses).toHaveLength(usersData.length);

        for (let i = 0; i < responses.length; ++i) {
            const response = responses[i];
            const userInfo = usersInfo[i];

            assert(response.body.kind === "single");
            expect(response.body.singleResult.errors).toBeUndefined();
            expect(response.body.singleResult.data?.createUser).toEqual(userInfo);
        }
    });
});

describe("Authenticated users", () => {
    let usersResponses: GraphQLResponse[];

    beforeEach(async () => {
        await UserModel.deleteMany({});

        const responsePromises = usersData
            .map((user) => ({ input: user }))
            .map((variables) => testUtils.testServer().executeOperation({ query: CreateUser, variables }));
        usersResponses = await Promise.all(responsePromises);
    });

    it("can show all users to admin only", async () => {
        assert(usersResponses[0].body.kind === "single");
        const admin: User = usersResponses[0].body.singleResult.data?.createUser as User;

        const adminResponse = await testUtils
            .testServer()
            .executeOperation({ query: GetUsers }, { contextValue: { user: admin } });

        assert(adminResponse.body.kind === "single");
        expect(adminResponse.body.singleResult.errors).toBeUndefined();
        expect(adminResponse.body.singleResult.data?.getUsers).toHaveLength(usersInfo.length);

        const users: User[] = adminResponse.body.singleResult.data?.getUsers as User[];

        for (let i = 0; i < users.length; ++i) {
            const response = usersResponses[i];
            const userInfo = usersInfo[i];

            assert(response.body.kind === "single");
            expect(response.body.singleResult.errors).toBeUndefined();
            expect(response.body.singleResult.data?.createUser).toEqual(userInfo);
        }

        assert(usersResponses[1].body.kind === "single");
        const user: User = usersResponses[1].body.singleResult.data?.createUser as User;

        const userResponse = await testUtils
            .testServer()
            .executeOperation({ query: GetUsers }, { contextValue: { user: user } });

        assert(userResponse.body.kind === "single");
        expect(userResponse.body.singleResult.errors).toBeDefined();
        expect(userResponse.body.singleResult.data?.getUsers).toBeUndefined();
    });

    it("can delete themselves", async () => {
        assert(usersResponses[0].body.kind === "single");
        const user: User = usersResponses[0].body.singleResult.data?.createUser as User;
        const userInDb = (await UserModel.findOne({ name: user.name }).lean()) as User;
        logger.info(userInDb.name, "User to delete is");

        const deleteResponse = await testUtils
            .testServer()
            .executeOperation({ query: DeleteUser }, { contextValue: { user: userInDb } });

        assert(deleteResponse.body.kind === "single");
        expect(deleteResponse.body.singleResult.errors).toBeUndefined();
        expect(deleteResponse.body.singleResult.data?.deleteUser).toEqual(user);
    });

    it("get all their transactions removed when the user is deleted", () => {
        throw new Error("TODO: Implement test");
    });

    it("can log in with the right credentials", async () => {
        const loginResponse = await testUtils.testServer().executeOperation({
            query: Login,
            variables: { input: { email: "tom.cruise@gmail.com", password: "test-password" } as LoginInput },
        });

        assert(loginResponse.body.kind === "single");
        expect(loginResponse.body.singleResult.errors).toBeUndefined();
        expect(loginResponse.body.singleResult.data?.login).toBeDefined();
    });

    it("refuses to log in wrong credentials", async () => {
        const loginResponse = await testUtils.testServer().executeOperation({
            query: Login,
            variables: { input: { email: "tom.and.jerry@gmail.com", password: "test-password" } as LoginInput },
        });

        assert(loginResponse.body.kind === "single");
        expect(loginResponse.body.singleResult.errors).toBeDefined();
        expect(loginResponse.body.singleResult.data?.login).toBeUndefined();
    });
});
