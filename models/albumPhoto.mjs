import mongoose from 'mongoose';

const photoAlbumSchema = new mongoose.Schema({
  evenement: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  photos: [
    {
      url: { type: String, required: true },
      auteur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      date: { type: Date, default: Date.now },
      commentaires: [
        {
          auteur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
          texte: { type: String, required: true },
          date: { type: Date, default: Date.now }
        }
      ]
    }
  ]
}, { timestamps: true });

export default photoAlbumSchema;