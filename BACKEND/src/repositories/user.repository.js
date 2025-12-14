import User from "../models/user.model.js";

class UserRepository {
    async updateStatus(id, status) {
      return User.findByIdAndUpdate(id, { status }, { new: true });
    }
  async findByEmail(email) {
    return User.findOne({ email });
  }

  async create(data) {
    const user = new User(data);
    return user.save();
  }

  async findById(id) {
    return User.findById(id);
  }

  async findDrivers() {
    return User.find({ role: 'Driver'});
  }
}

export default UserRepository
