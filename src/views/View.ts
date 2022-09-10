import { Model, HasId } from "../models/Model";

export abstract class View<T extends Model<K>, K extends HasId> {
  constructor(public parent: Element, public model: T) {
    this.bindModel();
  }

  abstract eventsMap(): { [key: string]: () => void };
  abstract template(): string;

  bindModel(): void {
    this.model.on("change", () => {
      this.render();
    });
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
