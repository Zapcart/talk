import { model, models, Schema, type InferSchemaType } from 'mongoose';

const agentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    agentName: { type: String, required: true, trim: true, maxlength: 100 },
    language: { type: String, enum: ['Hindi', 'Hinglish', 'English'], required: true },
    systemPrompt: { type: String, required: true, trim: true, maxlength: 20_000 },
    voiceId: { type: String, required: true, trim: true },
    twilioPhoneNumber: { type: String, required: true, trim: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active', index: true },
    paymentOrderId: { type: String, trim: true, sparse: true, unique: true },
    paymentId: { type: String, trim: true, sparse: true, unique: true },
    businessProfile: { type: String, default: '', trim: true, maxlength: 10_000 },
    faqs: { type: String, default: '', trim: true, maxlength: 20_000 },
    pricing: { type: String, default: '', trim: true, maxlength: 10_000 },
  },
  { timestamps: true },
);

agentSchema.index({ userId: 1, status: 1 });

export type AgentDocument = InferSchemaType<typeof agentSchema>;
export const Agent = models.Agent || model('Agent', agentSchema);
