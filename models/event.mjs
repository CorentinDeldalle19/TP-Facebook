import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: { type: String },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  lieu: { type: String, required: true },
  photoCouverture: { type: String },
  type: { type: String, enum: ['prive', 'public'], default: 'public' },
  organisateurs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  groupe: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', default: null }
}, { timestamps: true });

export default eventSchema;