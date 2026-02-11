import { describe, it, expect, vi, beforeEach } from "vitest";
import { PUT } from "@/app/api/alerts/[id]/route";
import { NextRequest } from "next/server";

import { Alert } from "@/database/models/alert.model";
import { connectDB } from "@/database/mongoose";
import { auth } from "@/lib/better-auth/auth";
import { revalidatePath } from "next/cache";
import {headers} from "next/headers";
import {POST} from "@/app/api/alerts/route";

// ---- mocks ----
vi.mock("@/database/mongoose", () => ({
    connectDB: vi.fn(),
}));

vi.mock("@/database/models/alert.model", () => ({
    Alert: {
        findOneAndUpdate: vi.fn(),
    },
}));

vi.mock("@/lib/better-auth/auth", () => ({
    auth: {
        api: {
            getSession: vi.fn(),
        },
    },
}));

vi.mock("next/cache", () => ({
    revalidatePath: vi.fn(),
}));

vi.mock("next/headers", () => ({
    headers: vi.fn(),
}));

const createRequest = (body: unknown) =>
    new NextRequest("http://localhost/api/alerts/alert_123", {
        method: "PUT",
        body: JSON.stringify(body),
    });

// Request
const request = new Request("http://localhost/api/alerts", {
    method: "PUT",
    body: JSON.stringify({}),
    headers: {
        "Content-Type": "application/json",
    },
}) as any;

describe("PUT /api/alerts/:id — Update Alert", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns 401 when user is not authenticated", async () => {
        // 1️⃣ Arrange
        (auth.api.getSession as any).mockResolvedValue(null);
        (headers as any).mockReturnValue(new Headers());


        // 2️⃣ Act
        const response = await POST(request);
        const data = await response.json();

        // 3️⃣ Assert
        expect(response.status).toBe(401);
        expect(data).toEqual({ error: "Unauthorized" });
    });

    it("returns 200 and updates alert successfully", async () => {
        // 1️⃣ auth
        (auth.api.getSession as any).mockResolvedValue({
            user: { id: "user_123" },
        });

        // 2️⃣ db
        (connectDB as any).mockResolvedValue(undefined);

        (Alert.findOneAndUpdate as any).mockResolvedValue({
            _id: "alert_123",
            identifier: "AAPL",
            name: "Apple Alert",
            threshold: 200,
            condition: "Less than",
            frequency: "Once per day",
        });

        // 3️⃣ request
        const req = createRequest({
            threshold: 200,
            condition: "Less than",
            frequency: "Once per day",
        });

        // 4️⃣ call route
        const response = await PUT(req, {
            params: Promise.resolve({ id: "alert_123" }),
        });

        const data = await response.json();

        // 5️⃣ assertions
        expect(response.status).toBe(200);

        expect(Alert.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: "alert_123", userId: "user_123" },
            { $set: { threshold: 200, condition: "Less than", frequency: "Once per day" } },
            { new: true }
        );

        expect(revalidatePath).toHaveBeenCalledWith("/watchlist");

        expect(data).toEqual({
            alert: {
                id: "alert_123",
                symbol: "AAPL",
                company: "Apple Alert",
                alertName: "Apple Alert",
                alertType: "lower",
                condition: "Less than",
                frequency: "Once per day",
                threshold: 200,
            },
        });
    });
});
