import { lazy, Suspense } from "react";

// Lazy load each component individually from @hello-pangea/dnd
const LazyDragDropContextComponent = lazy(() => import("@hello-pangea/dnd").then((module) => ({ default: module.DragDropContext })));

const LazyDroppableComponent = lazy(() => import("@hello-pangea/dnd").then((module) => ({ default: module.Droppable })));

const LazyDraggableComponent = lazy(() => import("@hello-pangea/dnd").then((module) => ({ default: module.Draggable })));

export function LazyDragDropContext(props: any) {
  return (
    <Suspense fallback={null}>
      <LazyDragDropContextComponent {...props} />
    </Suspense>
  );
}

export function LazyDroppable(props: any) {
  return (
    <Suspense fallback={null}>
      <LazyDroppableComponent {...props} />
    </Suspense>
  );
}

export function LazyDraggable(props: any) {
  return (
    <Suspense fallback={null}>
      <LazyDraggableComponent {...props} />
    </Suspense>
  );
}
