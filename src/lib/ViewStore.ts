import { View } from "./View";

export default class ViewStore {
  private static instance: ViewStore;
  private viewMap: Map<View<any>, [View<any>, HTMLElement | null]>;

  private constructor() {
    this.viewMap = new Map();
  }

  public static getInstance(): ViewStore {
    if (!ViewStore.instance) {
      ViewStore.instance = new ViewStore();
    }
    return ViewStore.instance;
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

    return this.deepPropsEqual(existingView[0], view);
  }
 
  private deepPropsEqual(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1.props) === JSON.stringify(obj2.props);
  }

}
