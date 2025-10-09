'use client';

interface SelectionBoxProps {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

export default function SelectionBox({
  startX,
  startY,
  currentX,
  currentY
}: SelectionBoxProps) {
  const left = Math.min(startX, currentX);
  const top = Math.min(startY, currentY);
  const width = Math.abs(currentX - startX);
  const height = Math.abs(currentY - startY);

  if (width < 5 || height < 5) return null;

  return (
    <div
      className="absolute pointer-events-none z-50"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
        border: '2px dashed #3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
      }}
    />
  );
}

export function getElementsInSelection(
  elements: any[],
  selectionBox: { left: number; top: number; width: number; height: number }
): string[] {
  return elements
    .filter(element => {
      const elementRight = element.x + element.width;
      const elementBottom = element.y + element.height;
      const selectionRight = selectionBox.left + selectionBox.width;
      const selectionBottom = selectionBox.top + selectionBox.height;

      // Check if element intersects with selection box
      return !(
        elementRight < selectionBox.left ||
        element.x > selectionRight ||
        elementBottom < selectionBox.top ||
        element.y > selectionBottom
      );
    })
    .map(element => element.id);
}
