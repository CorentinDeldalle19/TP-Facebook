import userSchema from '../models/user.mjs';

export default class Users {
  constructor(app, connection) {
    this.app = app;
    this.connection = connection;
    
    this.UserModel = this.connection.models.User || this.connection.model('User', userSchema);
    this.run();
  }

  run() {
    this.app.post('/api/users', async (req, res) => {
      try {
        const user = new this.UserModel(req.body);
        await user.save();
        res.status(201).json(user);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

    this.app.get('/api/users', async (req, res) => {
      try {
        const users = await this.UserModel.find();
        res.json(users);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  }
}