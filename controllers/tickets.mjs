import mongoose from 'mongoose';

const ticketTypeSchema = new mongoose.Schema({
  evenement: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  nom: { type: String, required: true },
  montant: { type: Number, required: true },
  quantiteLimite: { type: Number, required: true }
});

const purchasedTicketSchema = new mongoose.Schema({
  ticketType: { type: mongoose.Schema.Types.ObjectId, ref: 'TicketType', required: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  adresseComplete: { type: String, required: true },
  dateAchat: { type: Date, default: Date.now }
});
purchasedTicketSchema.index({ ticketType: 1, nom: 1, prenom: 1 }, { unique: true });

export default class Tickets {
  constructor(app, connection) {
    this.app = app;
    this.connection = connection;
    
    this.TicketTypeModel = this.connection.models.TicketType || this.connection.model('TicketType', ticketTypeSchema);
    this.PurchasedModel = this.connection.models.PurchasedTicket || this.connection.model('PurchasedTicket', purchasedTicketSchema);
    
    this.run();
  }

  run() {
    this.app.post('/api/tickets/types', async (req, res) => {
      try {
        const ticketType = new this.TicketTypeModel(req.body);
        await ticketType.save();
        res.status(201).json(ticketType);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

    this.app.post('/api/tickets/buy', async (req, res) => {
      try {
        const { ticketTypeId, nom, prenom, adresseComplete } = req.body;
        const ticketType = await this.TicketTypeModel.findById(ticketTypeId);
        if (!ticketType) return res.status(404).json({ error: 'Type de billet introuvable' });

        const count = await this.PurchasedModel.countDocuments({ ticketType: ticketTypeId });
        if (count >= ticketType.quantiteLimite) {
          return res.status(400).json({ error: 'Billets épuisés.' });
        }

        const purchased = new this.PurchasedModel({ ticketType: ticketTypeId, nom, prenom, adresseComplete });
        await purchased.save();
        res.status(201).json({ message: 'Achat réussi', purchased });
      } catch (error) {
        res.status(400).json({ error: 'Achat impossible (Un seul billet par personne ou erreur).' });
      }
    });
  }
}