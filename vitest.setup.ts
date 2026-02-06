import {beforeAll, afterAll, afterEach} from "vitest";
import {server} from "./__tests__/mocks/server";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());