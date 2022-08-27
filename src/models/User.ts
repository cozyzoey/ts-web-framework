import { AxiosResponse } from "axios";
import { Eventing } from "./Eventing";
import { Sync } from "./Sync";
import { Attributes } from "./Attributes";

export interface UserProps {
  id?: number; //id가 있으면 백엔드에서 불러온 것이고, 없으면 새로 생성된 객체
  name?: string;
  age?: number;
}
const rootUrl = "http://localhost:3000/users";

export class User {
  public events: Eventing = new Eventing(); //이벤팅 클래스는 general해서 이렇게 하드코딩하는게 좋은 선택
  public sync: Sync<UserProps> = new Sync<UserProps>(rootUrl);
  public attributes: Attributes<UserProps>;

  constructor(attrs: UserProps) {
    this.attributes = new Attributes<UserProps>(attrs);
  }

  // on, trigger, get
  // 메서드를 호출하는 것이 아니라 참조를 반환하는 것
  get on() {
    return this.events.on;
  }

  get trigger() {
    return this.events.trigger;
  }

  get get() {
    return this.attributes.get;
  }

  set(update: UserProps): void {
    this.attributes.set(update);
    this.events.trigger("change"); //user 데이터가 바뀌었으니까 관련된 이벤트들을 트리거해줌
  }

  fetch(): void {
    const id = this.attributes.get("id"); // id가 있으면 백엔드에 데이터가 있는 것, 없으면 새로운 데이터
    if (typeof id !== "number") {
      throw new Error("Cannot fetch without an id");
    }
    this.sync.fetch(id).then((response: AxiosResponse): void => {
      this.set(response.data);
    });
  }

  save(): void {
    this.sync
      .save(this.attributes.getAll())
      .then((response: AxiosResponse) => {
        this.trigger("save");
      })
      .catch(() => {
        this.trigger("error");
      });
  }
}
