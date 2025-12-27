import { Schema, model, models, type Document, type Model } from 'mongoose';

export interface AlertItem extends Document {
      userId: string;
      name: string;
      identifier: string;
      type: string;
      condition: string;
      threshold: Number;
      frequency: string;
      addedAt: Date;
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
   },
   threshold: {
      type: Number,
      required: true
   },
   frequency: {
     type: String,
     required: true, 
   },
   addedAt: {
      type: Date,
      default: Date.now,
      index: true,
   },
});

AlertSchema.index({userId: 1, identifier: 1, condition: 1, threshold: 1}, {unique: true});

export const Alert: Model<AlertItem> = 
    (models?.Alert as Model<AlertItem>) || model<AlertItem>('Alert', AlertSchema);
