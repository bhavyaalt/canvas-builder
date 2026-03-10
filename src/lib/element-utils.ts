// Utility functions for working with nested element trees
import { CanvasElement, ContainerElement } from './dsl/types';

// Find an element by ID in the tree
export function findElementById(
  elements: CanvasElement[],
  id: string
): CanvasElement | null {
  for (const el of elements) {
    if (el.id === id) return el;
    if (el.type === 'container' && el.children) {
      const found = findElementById(el.children, id);
      if (found) return found;
    }
  }
  return null;
}

// Find parent container of an element
export function findParentContainer(
  elements: CanvasElement[],
  childId: string,
  parent: ContainerElement | null = null
): ContainerElement | null {
  for (const el of elements) {
    if (el.id === childId) return parent;
    if (el.type === 'container' && el.children) {
      const found = findParentContainer(el.children, childId, el);
      if (found !== undefined) return found;
    }
  }
  return null;
}

// Get all container IDs (for parent selector dropdown)
export function getAllContainerIds(elements: CanvasElement[]): { id: string; label: string; depth: number }[] {
  const containers: { id: string; label: string; depth: number }[] = [];
  
  function traverse(els: CanvasElement[], depth: number) {
    for (const el of els) {
      if (el.type === 'container') {
        containers.push({
          id: el.id,
          label: `${'  '.repeat(depth)}📦 Container`,
          depth,
        });
        if (el.children) {
          traverse(el.children, depth + 1);
        }
      }
    }
  }
  
  traverse(elements, 0);
  return containers;
}

// Remove element from tree (returns new tree)
export function removeElementFromTree(
  elements: CanvasElement[],
  id: string
): CanvasElement[] {
  return elements
    .filter((el) => el.id !== id)
    .map((el) => {
      if (el.type === 'container' && el.children) {
        return {
          ...el,
          children: removeElementFromTree(el.children, id),
        };
      }
      return el;
    });
}

// Add element to a specific container (or root if containerId is null)
export function addElementToContainer(
  elements: CanvasElement[],
  element: CanvasElement,
  containerId: string | null
): CanvasElement[] {
  if (!containerId) {
    return [...elements, element];
  }
  
  return elements.map((el) => {
    if (el.id === containerId && el.type === 'container') {
      return {
        ...el,
        children: [...(el.children || []), element],
      };
    }
    if (el.type === 'container' && el.children) {
      return {
        ...el,
        children: addElementToContainer(el.children, element, containerId),
      };
    }
    return el;
  });
}

// Move element to a new parent
export function moveElementToContainer(
  elements: CanvasElement[],
  elementId: string,
  newContainerId: string | null
): CanvasElement[] {
  const element = findElementById(elements, elementId);
  if (!element) return elements;
  
  // Remove from current position
  let newTree = removeElementFromTree(elements, elementId);
  
  // Add to new position
  newTree = addElementToContainer(newTree, element, newContainerId);
  
  return newTree;
}

// Update an element in the tree
export function updateElementInTree(
  elements: CanvasElement[],
  id: string,
  updates: Record<string, unknown>
): CanvasElement[] {
  return elements.map((el) => {
    if (el.id === id) {
      return { ...el, ...updates } as CanvasElement;
    }
    if (el.type === 'container' && el.children) {
      return {
        ...el,
        children: updateElementInTree(el.children, id, updates),
      };
    }
    return el;
  });
}

// Flatten tree to list (for iteration)
export function flattenElements(elements: CanvasElement[]): CanvasElement[] {
  const flat: CanvasElement[] = [];
  
  function traverse(els: CanvasElement[]) {
    for (const el of els) {
      flat.push(el);
      if (el.type === 'container' && el.children) {
        traverse(el.children);
      }
    }
  }
  
  traverse(elements);
  return flat;
}

// Get element path (for display purposes)
export function getElementPath(
  elements: CanvasElement[],
  id: string,
  path: string[] = []
): string[] | null {
  for (const el of elements) {
    if (el.id === id) return path;
    if (el.type === 'container' && el.children) {
      const found = getElementPath(el.children, id, [...path, el.id]);
      if (found) return found;
    }
  }
  return null;
}
