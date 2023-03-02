import config from "config";
import db from "../database";
import { DatabaseError } from "../errors/database.error";
import { User } from "../models/user.model";

const authenticationCryptKey = config.get<string>("authentication.cryptKey");

interface UserRepository {
  create: (user: User) => any;
  findByUuid: (uuid: string) => any;
  findByUsernameAndPassword: (username: string, password: string) => any;
}

class userRepository implements UserRepository {
  async create(user: User): Promise<string> {
    try {
      const script = `
            INSERT INTO application_user (
                username,
                password
            )
            VALUES ($1, crypt($2, '${authenticationCryptKey}'))
            RETURNING uuid
        `;
      const values = [user.username, user.password];
      const queryResult = await db.query<{ uuid: string }>(script, values);
      const [row] = queryResult.rows;
      return row.uuid;
    } catch (error) {
      throw new DatabaseError({ log: "Erro ao inserir usuário", data: error });
    }
  }
  async findByUuid(uuid: string): Promise<User | null> {
    try {
      const query = `
        SELECT
            uuid,
            username
        FROM application_user
        WHERE uuid = $1
    `;
      const queryResult = await db.query<User>(query, [uuid]);
      const [row] = queryResult.rows;
      return !row ? null : row;
    } catch (error) {
      throw new DatabaseError({
        log: "Erro ao buscar usuário por uuid",
        data: error,
      });
    }
  }
  async findByUsernameAndPassword(
    username: string,
    password: string
  ): Promise<User | null> {
    const query = `
      SELECT
          uuid,
          username
      FROM application_user
      WHERE username = $1
      AND password = crypt($2, '${authenticationCryptKey}')
    `;
    const queryResult = await db.query(query, [username, password]);
    const [row] = queryResult.rows;
    return !row ? null : row;
  }
}

export default new userRepository();
