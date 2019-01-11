declare type InternalComponentOptions = {
  _isCompoennt: true;
  parent: Component;
  _parentVnode: VNode;
  render?: Function;
  staticRenderFns?: Array<Function>
};


