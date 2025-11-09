"use client"

interface SplashScreenProps {
  title: string
  version: string
  image: string
  description: string
  copyright: string
  company: string
  progress: number
  imageStyle?: React.CSSProperties
}

export function SplashScreen({ title, version, image, description, copyright, company, progress, imageStyle }: SplashScreenProps) {
  const isLargeTitle = ["Factory", "Registry", "Moosestack"].includes(title)
  const titleSize = isLargeTitle ? "text-7xl" : "text-5xl"

  return (
    <div
      className="flex flex-col items-center justify-start h-full p-4"
      style={{
        backgroundColor: "#c0c0c0",
        fontFamily: "MS Sans Serif, sans-serif",
      }}
    >
      <div className="text-center mb-4">
        <h1 className={`${titleSize} font-bold text-black mb-2`}>{title}</h1>
        <p className="text-sm text-black">Version {version}</p>
      </div>

      <div
        className="w-full mb-4 border-2 flex items-center justify-center"
        style={{
          borderTopColor: "#555",
          borderLeftColor: "#555",
          borderRightColor: "#dfdfdf",
          borderBottomColor: "#dfdfdf",
          backgroundColor: "#c0c0c0",
        }}
      >
        <img
          src={image || "/placeholder.svg"}
          alt={`${title} splash`}
          className="w-full"
          style={{
            objectFit: "cover",
            height: "auto",
            maxHeight: "150px",
            ...imageStyle,
          }}
          onError={(e) => {
            ;(e.target as HTMLImageElement).style.display = "none"
          }}
        />
      </div>

      <div className="text-center mb-4 max-w-xs">
        <p className="text-xs text-black leading-relaxed">{description}</p>
      </div>

      <div className="w-full max-w-xs mb-4">
        <div
          className="w-full h-4 border-2 overflow-hidden"
          style={{
            borderTopColor: "#555",
            borderLeftColor: "#555",
            borderRightColor: "#dfdfdf",
            borderBottomColor: "#dfdfdf",
            backgroundColor: "#808080",
          }}
        >
          <div
            className="h-full transition-all duration-300 win95-progress-bar"
            style={{
              width: `${Math.min(Math.max(progress, 0), 100)}%`,
              backgroundColor: "var(--win95-blue)", // Windows 95 blue
              maxWidth: "100%",
            }}
          />
        </div>
        <p className="text-xs text-black text-center mt-1">Loading... {Math.min(Math.max(progress, 0), 100)}%</p>
      </div>

      <div className="text-center">
        <p className="text-xs text-black">{copyright}</p>
        <p className="text-xs text-black">{company}</p>
      </div>
    </div>
  )
}
