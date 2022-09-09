import axios, { AxiosResponse } from "axios";
import { Eventing } from "./Eventing";

export class Collection<T, K> {
  models: T[] = [];
  events: Eventing = new Eventing();

  constructor(public rootUrl: string, public deserialize: (json: K) => T) {}

  get on() {
    return this.events.on;
  }

  get trigger() {
    return this.events.trigger;
  }

  fetch(): void {
    axios.get(this.rootUrl).then((response: AxiosResponse) => {
      response.data.forEach((value: K) => {
        // 기존 User에 제한된 코드
        // const user = User.buildUser(value)
        // this.models.push(user)

        // deserialize를 인자로 받아오도록 리팩토링함
        this.models.push(this.deserialize(value));
      });

      this.events.trigger("change");
    });
  }
}
