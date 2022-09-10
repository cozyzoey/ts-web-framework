import { User } from "../models/User";

export class UserForm {
  constructor(public parent: Element, public model: User) {
    this.bindModel();
  }

  bindModel(): void {
    this.model.on("change", () => {
      this.render();
    });
  }

  eventsMap(): { [key: string]: () => void } {
    return {
      "click:.set-age": this.onSetAgeClick,
      "click:.set-name": this.onSetNameClick,
    };
  }

  onSetAgeClick = (): void => {
    this.model.setRandomAge();
  };

  onSetNameClick = (): void => {
    const input = this.parent.querySelector("input");

    if (input) {
      const name = input.value;
      this.model.set({ name });
    }
  };

  template(): string {
    return `
      <div>
        <h1>User Form</h1>
        <div>User name: ${this.model.get("name")}</div>
        <div>User age: ${this.model.get("age")}</div>
        <input />
        <button class='set-name'>Change Name</button>
        <button class='set-age'>Set Random Age</button>
      </div>
    `;
  }

  bindEvents(fragment: DocumentFragment): void {
    const eventsMap = this.eventsMap();

    for (let eventKey in eventsMap) {
      const [eventName, selector] = eventKey.split(":");

      fragment.querySelectorAll(selector).forEach((element) => {
        element.addEventListener(eventName, eventsMap[eventKey]);
      });
    }
  }

  render(): void {
    // 렌더 메서드를 여러번 호출할 경우
    // parent에 달려있던 HTML 요소를 제거해서 중복해서 생기지 않도록 함
    // 그런데 parent 트리에 이 클래스와 다른 HTML이 달려 있다면 그것도 없어질텐데 문제가 없나 ?
    // 리액트의 경우 이전 HTML과 비교해서 달라진 부분만 업데이트 해줌
    this.parent.innerHTML = "";

    const templateElement = document.createElement("template");
    templateElement.innerHTML = this.template();

    this.bindEvents(templateElement.content);

    this.parent.append(templateElement.content);
  }
}
