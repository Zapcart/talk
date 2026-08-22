import { model, models, Schema, type InferSchemaType } from 'mongoose';

const campaignLogSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    campaignName: { type: String, required: true, trim: true, maxlength: 160 },
    campaignText: { type: String, default: '', trim: true, maxlength: 10_000 },
    contactCount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['draft', 'redirected', 'failed'], default: 'draft', index: true },
    redirectedToPartner: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

campaignLogSchema.index({ userId: 1, createdAt: -1 });

export type CampaignLogDocument = InferSchemaType<typeof campaignLogSchema>;
export const CampaignLog = models.CampaignLog || model('CampaignLog', campaignLogSchema);
