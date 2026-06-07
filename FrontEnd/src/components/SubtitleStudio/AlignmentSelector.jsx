export default function AlignmentSelector({ alignment, onChange }) {
  const alignments = [
    { value: 7, label: '↖', tooltip: 'Top Left' },
    { value: 8, label: '↑', tooltip: 'Top Center' },
    { value: 9, label: '↗', tooltip: 'Top Right' },
    { value: 4, label: '←', tooltip: 'Middle Left' },
    { value: 5, label: '•', tooltip: 'Middle Center' },
    { value: 6, label: '→', tooltip: 'Middle Right' },
    { value: 1, label: '↙', tooltip: 'Bottom Left' },
    { value: 2, label: '↓', tooltip: 'Bottom Center' },
    { value: 3, label: '↘', tooltip: 'Bottom Right' },
  ]

  return (
    <div>
      <label className="text-sm text-gray-300 font-medium block mb-3">Text Alignment</label>
      <div className="grid grid-cols-3 gap-2">
        {alignments.map(item => (
          <button
            key={item.value}
            onClick={() => onChange(item.value)}
            title={item.tooltip}
            className={`p-3 rounded-lg font-bold text-lg transition-all ${
              alignment === item.value
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        Position: {alignments.find(a => a.value === alignment)?.tooltip}
      </p>
    </div>
  )
}
