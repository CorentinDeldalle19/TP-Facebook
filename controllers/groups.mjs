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

export default class Groups {
  constructor(app, connection) {
    this.app = app;
    this.connection = connection;
    
    this.GroupModel = this.connection.models.Group || this.connection.model('Group', groupSchema);
    
    this.run();
  }

  run() {
    this.app.post('/api/groups', async (req, res) => {
      try {
        const group = new this.GroupModel(req.body);
        await group.save();
        res.status(201).json(group);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

    this.app.get('/api/groups', async (req, res) => {
      try {
        const groups = await this.GroupModel.find().populate('membres administrateurs');
        res.json(groups);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  }
}