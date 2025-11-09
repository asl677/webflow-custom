"use client"
import { openInFactory } from "./path-to-openInFactory" // Assuming openInFactory is a function that needs to be imported

const App = () => {
  const items = [{ name: "User Facing Analytics" }, { name: "Operational Datawarehouse" }, { name: "Other Item" }]

  return (
    <div>
      <table>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td className="text-black text-xs py-1 px-2">
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      openInFactory(item.name)
                    }}
                    className="win95-button px-2 py-1 text-xs"
                  >
                    Factory
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      let githubUrl = ""
                      if (item.name === "User Facing Analytics" || item.name === "Operational Datawarehouse") {
                        githubUrl = "https://github.com/514-labs/area-code"
                      } else {
                        const repoName = item.name.toLowerCase().replace(/\s+/g, "-")
                        githubUrl = `https://github.com/514-labs/registry/${repoName}`
                      }
                      window.open(githubUrl, "_blank")
                    }}
                    className="win95-button px-2 py-1 text-xs"
                  >
                    Github
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
