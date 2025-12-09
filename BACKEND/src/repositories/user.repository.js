import User from "../models/user.model.js";

class UserRepository {
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
}

export default UserRepository
