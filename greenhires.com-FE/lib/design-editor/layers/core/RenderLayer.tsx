import React, {
  createElement,
  FC,
  Fragment,
  ReactElement,
  useCallback,
  useMemo,
} from 'react';
import { useEditor, useLayer } from '../../hooks';
import LayerElement from './LayerElement';
import TransformLayer from './TransformLayer';

const RenderLayer: FC = () => {
  const { id, comp, props, layers, actions, parent } = useLayer((layer) => ({
    id: layer.id,
    comp: layer.data.comp,
    props: layer.data.props,
    layers: layer.data.child,
    parent: layer.data.parent,
  }));
  const { isResize, isDragging, isRotate } = useEditor((state) => ({
    isResize: state.resizeData.status,
    isDragging: state.dragData.status,
    isRotate: state.rotateData.status,
  }));
  const handleHover = useCallback(
    (e: React.MouseEvent) => {
      if (
        isResize ||
        !['ROOT', null].includes(parent) ||
        isDragging ||
        isRotate
      )
        return;
      e.stopPropagation();
      actions.hover();
    },
    [actions, isDragging, isResize, isRotate, parent]
  );
  const handleMouseOut = useCallback(() => {
    actions.hover(null);
  }, [actions]);

  return useMemo(() => {
    if (!comp) {
      return null;
    }
    let child: ReactElement | null = null;
    if (layers && layers.length > 0) {
      child = (
        <Fragment>
          {layers.map((id) => (
            <LayerElement key={id} id={id} />
          ))}
        </Fragment>
      );
    }
    if (id === 'ROOT') {
      const render = createElement(comp, { ...props, layerId: id }, child);
      return (
        <div
          onMouseLeave={handleMouseOut}
          onMouseOut={handleMouseOut}
          onMouseOver={handleHover}
        >
          {render}
        </div>
      );
    }
    const render = createElement(comp, { ...props, layerId: id }, child);
    return (
      <TransformLayer
        boxSize={props.boxSize}
        position={props.position}
        rotate={props.rotate}
        transparency={props.transparency}
      >
        <div
          onMouseLeave={handleMouseOut}
          onMouseOut={handleMouseOut}
          onMouseOver={handleHover}
        >
          {render}
        </div>
      </TransformLayer>
    );
  }, [comp, layers, id, props, handleMouseOut, handleHover]);
};

export default React.memo(RenderLayer);
