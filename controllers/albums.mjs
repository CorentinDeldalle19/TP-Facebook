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

export default class Albums {
  constructor(app, connection) {
    this.app = app;
    this.connection = connection;
    
    this.AlbumModel = this.connection.models.PhotoAlbum || this.connection.model('PhotoAlbum', photoAlbumSchema);
    
    this.run();
  }

  run() {
    this.app.post('/api/albums', async (req, res) => {
      try {
        const album = new this.AlbumModel(req.body);
        await album.save();
        res.status(201).json(album);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

    this.app.get('/api/albums', async (req, res) => {
      try {
        const albums = await this.AlbumModel.find().populate('evenement photos.auteur photos.commentaires.auteur');
        res.json(albums);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  }
}