import mongoose from 'mongoose';

const pollSchema = new mongoose.Schema({
  evenement: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  createur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questions: [
    {
      intitule: { type: String, required: true },
      options: [
        {
          texteOption: { type: String, required: true },
          votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
        }
      ]
    }
  ]
}, { timestamps: true });

export default pollSchema;