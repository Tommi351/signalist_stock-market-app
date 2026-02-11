// __tests__/integration/alerts/createAlert.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/alerts/route";
import { NextRequest } from "next/server";

// ---- mocks ----
import { Alert } from "@/database/models/alert.model";
import { connectDB } from "@/database/mongoose";
import { auth } from "@/lib/better-auth/auth";
import { inngest } from "@/lib/inngest/client";
import { revalidatePath } from "next/cache";
import {headers} from "next/headers";


// 🔥 mock modules
vi.mock("@/database/mongoose", () => ({
    connectDB: vi.fn(),
}));

vi.mock("@/database/models/alert.model", () => ({
    Alert: {
        findOne: vi.fn(),
        create: vi.fn(),
    },
}));

vi.mock("@/lib/better-auth/auth", () => ({
    auth: {
        api: {
            getSession: vi.fn(),
        },
    },
}));

vi.mock("@/lib/inngest/client", () => ({
    inngest: {
        send: vi.fn(),
    },
}));

vi.mock("next/cache", () => ({
    revalidatePath: vi.fn(),
}));

vi.mock("next/headers", () => ({
    headers: vi.fn(),
}));


// ---- helpers ----
const createRequest = (body: unknown) =>
    new NextRequest("http://localhost/api/alerts", {
        method: "POST",
        body: JSON.stringify(body),
    });


// Request
const request = new Request("http://localhost/api/alerts", {
    method: "POST",
    body: JSON.stringify({}),
    headers: {
        "Content-Type": "application/json",
    },
}) as any;

describe("POST /api/alerts - Create Alert", () => {
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

    it("TC-2A-5: returns 201 and creates alert successfully", async () => {
        // 1️⃣ mock auth
        (auth.api.getSession as any).mockResolvedValue({
            user: { id: "user_123" },
        });

        // 2️⃣ mock DB
        (connectDB as any).mockResolvedValue(undefined);

        // no duplicate
        (Alert.findOne as any).mockResolvedValue(null);

        // created alert doc
        (Alert.create as any).mockResolvedValue({
            _id: "alert_123",
            identifier: "AAPL",
            name: "Apple Alert",
            threshold: 150,
            condition: "Greater than",
            frequency: "Once per minute",
        });

        // side effects
        (inngest.send as any).mockResolvedValue(undefined);
        (revalidatePath as any).mockResolvedValue(undefined);

        // 3️⃣ request
        const req = createRequest({
            symbol: "AAPL",
            company: "Apple",
            alertName: "Apple Alert",
            alertType: "upper",
            threshold: 150,
            condition: "Greater than",
            frequency: "Once per minute",
        });

        // 4️⃣ call route
        const response = await POST(req);
        const data = await response.json();

        // 5️⃣ assertions
        expect(response.status).toBe(201);

        expect(Alert.findOne).toHaveBeenCalled();
        expect(Alert.create).toHaveBeenCalled();

        expect(inngest.send).toHaveBeenCalledWith({
            name: "app/sent.alert",
            data: { alertId: "alert_123" },
        });

        expect(revalidatePath).toHaveBeenCalledWith("/watchlist");

        expect(data).toEqual({
            success: true,
            message: "Alert created successfully",
            alert: {
                id: "alert_123",
                symbol: "AAPL",
                company: "Apple Alert",
                alertName: "Apple Alert",
                condition: "Greater than",
                alertType: "upper",
                frequency: "Once per minute",
                threshold: 150,
            },
        });
    });
});
