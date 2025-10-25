import * as React from "react"

export interface Asset {
  name: string;
  id?: string;
  type?: string;
  [key: string]: string | number | boolean | object | undefined;
}

export interface DraggableAssetProps {
  asset: Asset
}

export const DraggableAsset: React.FC<DraggableAssetProps> = ({ asset }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("asset", JSON.stringify(asset))
  }
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="bg-white border border-blue-100 rounded-xl px-3 py-2 text-left hover:bg-blue-100 hover:shadow-lg cursor-grab shadow transition-all duration-150 select-none"
      style={{ marginBottom: 8 }}
    >
      <span className="text-blue-700 font-semibold">{asset.name}</span>
    </div>
  )
}
