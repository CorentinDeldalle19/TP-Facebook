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

export default class Discussions {
  constructor(app, connection) {
    this.app = app;
    this.connection = connection;
    this.DiscussionModel = this.connection.models.Discussion || this.connection.model('Discussion', discussionSchema);
    this.run();
  }

  run() {
    this.app.post('/api/discussions/:id/messages', async (req, res) => {
      try {
        const discussion = await this.DiscussionModel.findById(req.params.id);
        if (!discussion) return res.status(404).json({ error: 'Error' });

        discussion.messages.push(req.body);
        await discussion.save();
        res.status(201).json(discussion);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });
  }
}