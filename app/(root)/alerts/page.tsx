'use client';

import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";
import {
    ALERT_TYPE_OPTIONS,
    CONDITION_OPTIONS, FREQUENCY_OPTIONS,
} from "@/lib/constants";
import {useAlerts} from "@/hooks/useAlerts";
import {redirect} from "next/navigation";
import {toast} from "sonner";


const AlertForm = () => {
    const {createAlert} = useAlerts();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<AlertsData>({
        defaultValues: {
            symbol: '',
            company: '',
            alertName: 'Apple at Discount',
            alertType: "upper",
            threshold: 200,
        },
        mode: 'onBlur'
    }, );


    const onSubmit = async (payload: AlertsData) => {
        console.log("Submitting data...");
        try {
            const result = await createAlert(payload);
            if(result.success) {
                console.log("Success");
            }
        } catch (e) {
            console.error(e);
            toast.error('Alert creation failed', {
                description: e instanceof Error ? e.message : 'Failed to create an alert.'
            })
        }

        redirect('/watchlist');
    }

    return (
        <>
            <h1 className="form-title">Price Alert</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <InputField
                    name="alertName"
                    label="Alert Name"
                    placeholder=""
                    register={register}
                    error={errors.alertName}
                    validation={{ required: 'Alert name is required', minLength: 2 }}
                />

                <InputField
                    name="symbol"
                    label="Stock Identifier"
                    placeholder="Apple Inc (AAPL)"
                    register={register}
                    error={errors.symbol}
                    validation={{ required: 'Stock identifier is required', maxLength: 25 }}
                />

                <SelectField
                    name="alertType"
                    label="Alert Type"
                    placeholder="Price"
                    options={ALERT_TYPE_OPTIONS}
                    control={control}
                    error={errors.alertType}
                    required
                />

                <SelectField
                    name="condition"
                    label="Condition"
                    placeholder="Greater Than (>)"
                    options={CONDITION_OPTIONS}
                    control={control}
                    error={errors.condition}
                    required
                />

                <InputField
                    name="threshold"
                    label="Threshold value"
                    placeholder="eg: 140"
                    register={register}
                    error={errors.threshold}
                    validation={{ required: 'Alert name is required', minLength: 2 }}
                />

                <SelectField
                    name="frequency"
                    label="Frequency"
                    placeholder="Once per day"
                    options={FREQUENCY_OPTIONS}
                    control={control}
                    error={errors.frequency}
                    required
                />

                <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
                    {isSubmitting ? 'Creating your alert ...' : 'Create Alert'}
                </Button>

            </form>
        </>
    )
}
export default AlertForm;
