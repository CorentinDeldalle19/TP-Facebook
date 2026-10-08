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

export default class Polls {
  constructor(app, connection) {
    this.app = app;
    this.connection = connection;
    this.PollModel = this.connection.models.Poll;
    this.run();
  }

  run() {
    this.app.post('/api/polls', async (req, res) => {
      try {
        const poll = new this.PollModel(req.body);
        await poll.save();
        res.status(201).json(poll);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });
  }
}