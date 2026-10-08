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

export default class Events {
  constructor(app, connection) {
    this.app = app;
    this.connection = connection;
    this.EventModel = this.connection.models.Event || this.connection.model('Event', eventSchema);
    this.run();
  }

  run() {
    this.app.post('/api/events', async (req, res) => {
      try {
        const event = new this.EventModel(req.body);
        await event.save();
        res.status(201).json(event);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

    this.app.get('/api/events', async (req, res) => {
      try {
        const events = await this.EventModel.find().populate('organisateurs participants groupe');
        res.json(events);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  }
}