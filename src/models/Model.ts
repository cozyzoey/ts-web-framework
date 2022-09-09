import { AxiosPromise, AxiosResponse } from "axios";

interface ModelAttributes<T> {
  set(value: T): void;
  getAll(): T;
  get<K extends keyof T>(key: K): T[K];
}

interface Sync<T> {
  fetch(id: number): AxiosPromise;
  save(data: T): AxiosPromise;
}

interface Events {
  on(eventName: string, callback: () => void): void;
  trigger(eventName: string): void;
}

interface HasId {
  id?: number;
}

export class Model<T extends HasId> {
  constructor(
    private attributes: ModelAttributes<T>,
    private events: Events,
    private sync: Sync<T>
  ) {}

  on = this.events.on;
  trigger = this.events.trigger;
  get = this.attributes.get;

  set(update: T): void {
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
