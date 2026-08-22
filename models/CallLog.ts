import { model, models, Schema, type InferSchemaType } from 'mongoose';

const callLogSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    agentId: { type: Schema.Types.ObjectId, ref: 'Agent', required: true, index: true },
    callerNumber: { type: String, required: true, trim: true },
    duration: { type: Number, required: true, min: 0 },
    transcript: { type: String, default: '', trim: true },
    summary: { type: String, default: '', trim: true },
    leadTemperature: { type: String, enum: ['Hot', 'Warm', 'Cold'], default: 'Warm', index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

callLogSchema.index({ userId: 1, createdAt: -1 });

export type CallLogDocument = InferSchemaType<typeof callLogSchema>;
export const CallLog = models.CallLog || model('CallLog', callLogSchema);
