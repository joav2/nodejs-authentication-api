import { User } from "../models/user.model";
import userRepository from "../repositories/user.repository";

class UserService {
  async create(user: User) {
    return await userRepository.create(user);
  }
  async findByUuid(uuid: string) {
    const user: User | null = await userRepository.findByUuid(uuid);
    if (!user) {
    }
    return user;
  }
  async findByUsernameAndPassword(username: string, password: string) {
    return await userRepository.findByUsernameAndPassword(username, password);
  }
}

export default new UserService();
