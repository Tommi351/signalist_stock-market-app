import { Schema, model, models, type Model } from 'mongoose';

export interface AlertItem {
      userId: string;
      name: string;
      identifier: string;
      type: string;
      condition: "Greater than" | "Less than" | "Equal to";
      threshold: number;
      frequency: string;
      createdAt: Date;
      updatedAt: Date;
}

const AlertSchema = new Schema<AlertItem>({
   userId: {
      type: String,
      required: true,
      index: true,
   },
   name: {
      type: String,
      required: true,
   },
   identifier: {
      type: String,
      required: true,
      trim: true,
   },
   type: {
      type: String,
      required: true,
      index: true,
   },
   condition: {
      type: String,
      required: true,
       enum: ["Greater than", "Less than", "Equal to"],
   },
   threshold: {
      type: Number,
      required: true
   },
   frequency: {
     type: String,
     required: true,
       enum: ["Once per minute", "Once per hour", "Once per day"],
   },
},
    {timestamps: true}); // Automatically adds createdAt and updatedAt

AlertSchema.index({userId: 1, identifier: 1, condition: 1, threshold: 1}, {unique: true});

export const Alert: Model<AlertItem> = 
    (models?.Alert as Model<AlertItem>) || model<AlertItem>('Alert', AlertSchema);
