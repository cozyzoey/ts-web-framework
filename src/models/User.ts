import { Model } from "./Model";
import { Attributes } from "./Attributes";
import { ApiSync } from "./ApiSync";
import { Eventing } from "./Eventing";
import { Collection } from "./Collection";

export interface UserProps {
  id?: number; //id가 있으면 백엔드에서 불러온 것이고, 없으면 새로 생성된 객체
  name?: string;
  age?: number;
}
const rootUrl = "http://localhost:3000/users";

export class User extends Model<UserProps> {
  static buildUser(attrs: UserProps): User {
    return new User(
      new Attributes<UserProps>(attrs),
      new Eventing(),
      new ApiSync<UserProps>(rootUrl)
    );
  }

  static buildUserCollection(): Collection<User, UserProps> {
    return new Collection<User, UserProps>(rootUrl, User.buildUser);
  }

  setRandomAge(): void {
    const age = Math.round(Math.random() * 100);
    this.set({ age });
  }
}
