"use client"

interface UniversalFooterProps {
  status?: string
  progress?: number
  isDownloading?: boolean
}

export function UniversalFooter({ status = "Ready", progress = 0, isDownloading = false }: UniversalFooterProps) {
  if (isDownloading && progress < 100) {
    return (
      <div className="flex items-center justify-between w-full">
        <span className="text-black" style={{ fontFamily: '"w95fa", "MS Sans Serif", sans-serif', fontSize: "11px" }}>
          {Math.round(progress)}% complete
        </span>
        <div
          className="w-20 h-2 border"
          style={{
            backgroundColor: "#c0c0c0",
            borderTopColor: "#808080",
            borderLeftColor: "#808080",
            borderRightColor: "#dfdfdf",
            borderBottomColor: "#dfdfdf",
          }}
        >
          <div
            className="h-full transition-all duration-200"
            style={{
              width: `${progress}%`,
              backgroundColor: "#000080",
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <span className="text-black" style={{ fontFamily: '"w95fa", "MS Sans Serif", sans-serif', fontSize: "11px" }}>
      {status}
    </span>
  )
}
