import mongoose from 'mongoose';

export const ticketTypeSchema = new mongoose.Schema({
  evenement: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  nom: { type: String, required: true },
  montant: { type: Number, required: true },
  quantiteLimite: { type: Number, required: true }
});

export const purchasedTicketSchema = new mongoose.Schema({
  ticketType: { type: mongoose.Schema.Types.ObjectId, ref: 'TicketType', required: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  adresseComplete: { type: String, required: true },
  dateAchat: { type: Date, default: Date.now }
});

purchasedTicketSchema.index({ ticketType: 1, nom: 1, prenom: 1 }, { unique: true });