interface Tool {
  id: number
  slug: string
  name: string
  description: string
  category: string
}

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <div className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
      <p className="text-gray-600">{tool.description}</p>
      <div className="mt-2 text-sm text-gray-500">{tool.category}</div>
    </div>
  )
}
