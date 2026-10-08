import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: { type: String },
  icone: { type: String },
  photoCouverture: { type: String },
  type: { type: String, enum: ['public', 'prive', 'secret'], default: 'public' },
  autoriserPublicationMembres: { type: Boolean, default: true },
  autoriserCreationEvenementsMembres: { type: Boolean, default: true },
  membres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  administrateurs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }]
}, { timestamps: true });

export default groupSchema;