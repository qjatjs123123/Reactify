import { View } from "./View";

export default class ViewStore {
  private static instance: ViewStore;
  private viewMap: Map<View<any>, [View<any>, HTMLElement | null]>;
  public _viewMap : Map<String, View<any>>;

  private constructor() {
    this.viewMap = new Map();
    this._viewMap = new Map();
  }

  public static getInstance(): ViewStore {
    if (!ViewStore.instance) {
      ViewStore.instance = new ViewStore();
    }
    return ViewStore.instance;
  }

  public setViewMap(key: String, view: View<any>): void {
    this._viewMap.set(key, view);
  }

  public removeViewMap(key: String): void {
    this._viewMap.delete(key);
  }

  public getViewMap(key: String): View<any> {
    return this._viewMap.get(key);
  }

  public setViewMemo(view: View<any>, element: HTMLElement): void {
    this.viewMap.set(view, [view, element]);
  }

  public removeViewMemo(view: View<any>): void {
    this.viewMap.delete(view);
  }

  public clear(): void {
    this.viewMap.clear();
  }

  public getViewMemo(view: View<any>): HTMLElement | null {
    return this.viewMap.get(view)?.[1] ?? null;
}

  public isValidMemo(view: View<any>): boolean {
    const existingView = this.viewMap.get(view);
    if (!existingView) return false; 

    return this.isEquals(existingView[0], view);
  }
 
  private isEquals(obj1: any, obj2: any): boolean {
    return Object.is(obj1, obj2);
  }

}
