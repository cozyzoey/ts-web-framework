import { Model, HasId } from "../models/Model";

export abstract class View<T extends Model<K>, K extends HasId> {
  regions: { [key: string]: Element } = {};

  constructor(public parent: Element, public model: T) {
    this.bindModel();
  }

  abstract template(): string;

  /**
   * eventsMap이 자식 클래스에 있을수도, 없을수도 있다.(데이터 렌더링만 해주는 경우)
   * 그래서 abstract 대신 메서드로 정의해주면 자식 클래스에 필수가 아니게 된다.
   * 자식 클래스에서 eventsMap이 정의되면 덮어쓰기 된다.
   */
  eventsMap(): { [key: string]: () => void } {
    return {};
  }

  regionsMap(): { [key: string]: string } {
    return {};
  }

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

  mapRegions(fragment: DocumentFragment): void {
    const regionsMap = this.regionsMap();
    for (let key in regionsMap) {
      const selector = regionsMap[key];
      const element = fragment.querySelector(selector);

      if (element) {
        this.regions[key] = element;
      }
    }
  }

  // 자식 클래스에서 덮어쓰기 함
  onRender(): void {}

  render(): void {
    // 렌더 메서드를 여러번 호출할 경우
    // parent에 달려있던 HTML 요소를 제거해서 중복해서 생기지 않도록 함
    // 그런데 parent 트리에 이 클래스와 다른 HTML이 달려 있다면 그것도 없어질텐데 문제가 없나 ?
    // 리액트의 경우 이전 HTML과 비교해서 달라진 부분만 업데이트 해줌
    this.parent.innerHTML = "";

    const templateElement = document.createElement("template");
    templateElement.innerHTML = this.template();

    this.bindEvents(templateElement.content);

    // Nesting
    this.mapRegions(templateElement.content);
    this.onRender();

    this.parent.append(templateElement.content);
  }
}
