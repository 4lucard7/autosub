import { useState } from 'react'
import FontSelector from './FontSelector'
import ColorPicker from './ColorPicker'
import AlignmentSelector from './AlignmentSelector'

export default function SubtitleStylePanel({ style, onStyleChange }) {
  const [expandedSection, setExpandedSection] = useState('font')

  const handleToggle = (section) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const Section = ({ title, id, icon, children }) => (
    <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl overflow-hidden hover:border-gray-600/70 transition-colors">
      <button
        onClick={() => handleToggle(id)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-700/30 transition-colors"
      >
        <span className="text-lg">{icon}</span>
        <span className="font-semibold text-gray-200 flex-1 text-left">{title}</span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${
            expandedSection === id ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      {expandedSection === id && (
        <div className="px-5 py-4 border-t border-gray-700/30 bg-gray-900/20 space-y-4">
          {children}
        </div>
      )}
    </div>
  )

  const SliderInput = ({ label, value, min, max, step, onChange }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm text-gray-300 font-medium">{label}</label>
        <span className="px-3 py-1 bg-gray-700/50 rounded text-sm text-gray-100 font-mono">
          {value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
    </div>
  )

  const ToggleButton = ({ label, value, onChange }) => (
    <button
      onClick={() => onChange(!value)}
      className={`w-full px-4 py-2.5 rounded-lg font-semibold transition-all ${
        value
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
          : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="space-y-4">
      {/* Font & Size */}
      <Section title="Font & Size" id="font" icon="🔤">
        <FontSelector
          fontName={style.font_name}
          fontSize={style.font_size}
          onFontChange={name => onStyleChange({ font_name: name })}
          onSizeChange={size => onStyleChange({ font_size: size })}
        />
      </Section>

      {/* Text Styling */}
      <Section title="Text Styling" id="text" icon="✨">
        <div className="grid grid-cols-2 gap-3">
          <ToggleButton
            label="Bold"
            value={style.bold}
            onChange={val => onStyleChange({ bold: val })}
          />
          <ToggleButton
            label="Italic"
            value={style.italic}
            onChange={val => onStyleChange({ italic: val })}
          />
        </div>
      </Section>

      {/* Colors */}
      <Section title="Colors" id="colors" icon="🎨">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 font-medium block mb-2">Text Color</label>
            <ColorPicker
              color={style.text_color}
              onChange={color => onStyleChange({ text_color: color })}
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 font-medium block mb-2">Outline Color</label>
            <ColorPicker
              color={style.outline_color}
              onChange={color => onStyleChange({ outline_color: color })}
            />
          </div>

          <SliderInput
            label="Outline Width"
            value={style.outline_width}
            min={0}
            max={10}
            step={0.5}
            onChange={val => onStyleChange({ outline_width: val })}
          />

          <div>
            <label className="text-sm text-gray-300 font-medium block mb-2">Shadow Color</label>
            <ColorPicker
              color={style.shadow_color}
              onChange={color => onStyleChange({ shadow_color: color })}
            />
          </div>

          <SliderInput
            label="Shadow Depth"
            value={style.shadow_depth}
            min={0}
            max={10}
            step={0.5}
            onChange={val => onStyleChange({ shadow_depth: val })}
          />
        </div>
      </Section>

      {/* Background */}
      <Section title="Background Box" id="background" icon="📦">
        <div>
          <label className="text-sm text-gray-300 font-medium block mb-2">Background Color</label>
          <ColorPicker
            color={style.background_color}
            onChange={color => onStyleChange({ background_color: color })}
          />
        </div>

        <SliderInput
          label="Background Opacity"
          value={style.background_opacity}
          min={0}
          max={100}
          step={5}
          onChange={val => onStyleChange({ background_opacity: val })}
        />
      </Section>

      {/* Positioning */}
      <Section title="Positioning" id="position" icon="📍">
        <AlignmentSelector
          alignment={style.alignment}
          onChange={val => onStyleChange({ alignment: val })}
        />

        <SliderInput
          label="Left Margin"
          value={style.margin_l}
          min={0}
          max={500}
          step={10}
          onChange={val => onStyleChange({ margin_l: val })}
        />

        <SliderInput
          label="Right Margin"
          value={style.margin_r}
          min={0}
          max={500}
          step={10}
          onChange={val => onStyleChange({ margin_r: val })}
        />

        <SliderInput
          label="Vertical Margin"
          value={style.margin_v}
          min={0}
          max={500}
          step={10}
          onChange={val => onStyleChange({ margin_v: val })}
        />
      </Section>

      {/* Advanced */}
      <Section title="Advanced" id="advanced" icon="⚙️">
        <SliderInput
          label="Letter Spacing"
          value={style.letter_spacing}
          min={-5}
          max={10}
          step={0.5}
          onChange={val => onStyleChange({ letter_spacing: val })}
        />

        <SliderInput
          label="Line Spacing"
          value={style.line_spacing}
          min={0}
          max={5}
          step={0.1}
          onChange={val => onStyleChange({ line_spacing: val })}
        />
      </Section>
    </div>
  )
}
