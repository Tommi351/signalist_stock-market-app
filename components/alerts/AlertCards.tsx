'use client';

import React from 'react';
import {useState} from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {getAlertText, formatChangePercent, getChangeColorClass} from "@/lib/utils";
import {useForm} from "react-hook-form";
import {Controller} from "react-hook-form";
import {useStock} from "@/hooks/useStocks";

const AlertCards = ({id, symbol, company, alertName, alertType, threshold, frequency, updateAlert, deleteAlert}: AlertCardProps) => {
    // States
    const [open, setOpen] = useState(false);

    // For condition(>, < & =) text
    const conditionText = getAlertText({alertType, threshold} as AlertText);

    // For alerts editing and delete

    // For stocks details like currentPrice and changePercent
    const {stock, loading} = useStock(symbol);

    const currentPrice = stock?.currentPrice;
    const changePercent = stock?.changePercent;

    const { register, handleSubmit, control, formState } = useForm<UpdatedAlertDTO>({
        defaultValues: {
            threshold: 200,
            condition: "Greater than",
            frequency: "Once per day",
        },
    });

    const onSubmit = async (data: UpdatedAlertDTO) => {
        try {
            console.log("Submitting:", data);

            await updateAlert(id, {
                condition: data.condition,
                threshold: data.threshold,
                frequency: data.frequency,
            });

            setOpen(false);
        } catch (err) {
            console.error("Update failed:", err);
        }
    };

    return (
           <div className="alert-item">
               <div className="flex justify-between items-start mb-5">
                   <div>
                       <p className="text-xs text-gray-500">{alertName || company}</p>
                       <p className="font-semibold text-white leading-none">{loading ? "—" : `$${currentPrice}`}</p>
                   </div>
                   <div className="text-right">
                       <p className="text-xs text-gray-500">{symbol}</p>
                       <p className={`text-sm font-medium ${getChangeColorClass(changePercent)}`}>{loading ? "—" : formatChangePercent(changePercent)}</p>
                   </div>
               </div>

               {/* Alert Specifics */}
               <div className="flex justify-between items-start">
                   <div>
                       <p className="text-gray-300 font-medium">Alert:</p>
                       <p className="font-semibold text-white leading-none">{conditionText}</p>
                   </div>
                   <div className="justify-end">
                       <Button className="alert-update-btn" onClick={() => setOpen(true)}>Update</Button>

                       <Dialog open={open} onOpenChange={setOpen}>
                               <DialogContent className="sm:max-w-sm">
                                   <form onSubmit={handleSubmit(onSubmit)}>
                                   <DialogHeader>
                                       <DialogTitle>Edit Alerts</DialogTitle>
                                       <DialogDescription>
                                           Make changes to your alerts here. Click save when you&apos;re
                                           done.
                                       </DialogDescription>
                                   </DialogHeader>
                                   <FieldGroup>
                                       {/* Threshold Fields */}
                                       <Field>
                                           <Label htmlFor="threshold">Threshold</Label>
                                           <Input id="threshold" type="number" {...register("threshold", { valueAsNumber: true })} />
                                       </Field>
                                       {/* Condition Fields */}
                                       <Controller
                                           control={control}
                                           name="condition"
                                           render={({ field }) => (
                                           <Select value={field.value} onValueChange={field.onChange}>
                                               <SelectTrigger className="w-full max-w-48">
                                                   <SelectValue placeholder="Select your stock conditions" />
                                               </SelectTrigger>
                                               <SelectContent>
                                                   <SelectGroup>
                                                       <SelectLabel>Conditions</SelectLabel>
                                                       <SelectItem value="Greater than">Greater than threshold</SelectItem>
                                                       <SelectItem value="Less than">Less than threshold</SelectItem>
                                                       <SelectItem value="Equal to">Equal to threshold</SelectItem>
                                                   </SelectGroup>
                                               </SelectContent>
                                           </Select>
                                           )}
                                       />
                                       {/* Frequency Fields */}
                                       <Controller
                                           control={control}
                                           name="frequency"
                                           render={({ field }) => (
                                               <Select
                                                   value={field.value}
                                                   onValueChange={field.onChange}
                                               >
                                                   <SelectTrigger className="w-full max-w-48">
                                                       <SelectValue placeholder="Select frequency" />
                                                   </SelectTrigger>

                                                   <SelectContent>
                                                       <SelectGroup>
                                                           <SelectLabel>Frequencies</SelectLabel>
                                                           <SelectItem value="Once per minute">
                                                               Once per minute
                                                           </SelectItem>
                                                           <SelectItem value="Once per hour">
                                                               Once per hour
                                                           </SelectItem>
                                                           <SelectItem value="Once per day">
                                                               Once per day
                                                           </SelectItem>
                                                       </SelectGroup>
                                                   </SelectContent>
                                               </Select>
                                           )}
                                       />
                                   </FieldGroup>
                                   <DialogFooter>
                                       <Button
                                           type="button"
                                           variant="outline"
                                           onClick={() => setOpen(false)} // manually close on cancel
                                       >
                                           Cancel
                                       </Button>

                                       <Button type="submit" disabled={formState.isSubmitting}>
                                           Save changes
                                       </Button>
                                   </DialogFooter>
                                   </form>
                               </DialogContent>
                       </Dialog>
                       <Button className="alert-delete-btn" onClick={() => deleteAlert(id)}>Delete</Button>
                       <p className="alert-name">{frequency}</p>
                   </div>
               </div>

               </div>
       );
};

export default AlertCards;