import { Eventing } from "./Eventing";
import { Sync } from "./Sync";

export interface UserProps {
  id?: number; //id가 있으면 백엔드에서 불러온 것이고, 없으면 새로 생성된 객체
  name?: string;
  age?: number;
}
const rootUrl = "http://localhost:3000/users";

export class User {
  public events: Eventing = new Eventing(); //이벤팅 클래스는 general해서 이렇게 하드코딩하는게 좋은 선택
  public sync: Sync<UserProps> = new Sync<UserProps>(rootUrl);

  constructor(private data: UserProps) {}

  get(propName: string): string | number {
    return this.data[propName];
  }

  set(update: UserProps): void {
    Object.assign(this.data, update);
  }
}
