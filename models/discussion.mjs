import mongoose from 'mongoose';

const discussionSchema = new mongoose.Schema({
  groupe: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', default: null },
  evenement: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', default: null },
  messages: [
    {
      auteur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      contenu: { type: String, required: true },
      reponses: [
        {
          auteur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
          contenu: { type: String, required: true },
          date: { type: Date, default: Date.now }
        }
      ],
      date: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

export default discussionSchema;