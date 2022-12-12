import testUtils from "./testUtils";

beforeAll(async () => {
    await testUtils.startTestServer();
});

afterAll(async () => {
    await testUtils.terminateTestServer();
});
