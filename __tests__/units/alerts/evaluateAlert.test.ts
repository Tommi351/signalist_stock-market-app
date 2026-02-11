import {describe, expect, it} from "vitest";
import {evaluateAlertDirection} from "@/lib/utils";

describe("evaluateAlertDirection", () => {
    it("returns upper when currentPrice is greater than threshold", () => {
        const alert = {
            condition: "Greater than",
            threshold: 300,
        } as const

        const currentPrice = 350

       const result = evaluateAlertDirection(alert, currentPrice);

        expect(result).toBe("upper");
    });

    it("returns lower when currentPrice is less than threshold", () => {
        const alert = {
            condition: "Less than",
            threshold: 400,
        } as const

        const currentPrice = 320

        const result = evaluateAlertDirection(alert, currentPrice);

        expect(result).toBe("lower");
    });

    it("returns equal when currentPrice is equal to than threshold", () => {
        const alert = {
            condition: "Equal to",
            threshold: 1000,
        } as const

        const currentPrice = 1000;

        const result = evaluateAlertDirection(alert, currentPrice);

        expect(result).toBe("equal");
<<<<<<< HEAD
    });

=======
    })

    it("returns null when currentPrice is NOT greater than threshold", () => {
        const alert = { condition: "Greater than", threshold: 300 } as const;
        expect(evaluateAlertDirection(alert, 200)).toBeNull();
    });

    it("returns null when currentPrice equals threshold for 'Greater than'", () => {
        const alert = { condition: "Greater than", threshold: 300 } as const;
        expect(evaluateAlertDirection(alert, 300)).toBeNull();
    });

    it("throws on an invalid condition", () => {
        const alert = { condition: "Invalid", threshold: 300 } as any;
        expect(() => evaluateAlertDirection(alert, 350)).toThrow();
    });
>>>>>>> 04470e40df49d1990aa83ef44f2773b806b15b85
})