import {describe, expect, it} from "vitest";
import {getAlertText, formatPrice} from "@/lib/utils";

describe("getAlertText", () => {
    it("returns Price > threshold when alertType is greater", () => {
        const alert = {
            alertType: "upper",
            threshold: 120,
        } as const;

        const result = getAlertText(alert);

        expect(result).toBe(`Price > ${formatPrice(alert.threshold)}`);
    })

    it("returns Price < threshold when alertType is lower", () => {
        const alert = {
            alertType: "lower",
            threshold: 200,
        } as const;

        const result = getAlertText(alert);

        expect(result).toBe(`Price < ${formatPrice(alert.threshold)}`);
    })

    it("returns Price = threshold when alertType is equal", () => {
        const alert = {
            alertType: "equal",
            threshold: 300,
        } as const;

        const result = getAlertText(alert);

        expect(result).toBe(`Price = ${formatPrice(alert.threshold)}`);
    })
})