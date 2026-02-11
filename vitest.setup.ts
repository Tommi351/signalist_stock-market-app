import {beforeAll, afterAll, afterEach} from "vitest";
import {server} from "./__tests__/mocks/server";

import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });


beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());