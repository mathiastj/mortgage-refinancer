import React from 'react'
import Tooltip from './tooltip'

export default function LabelWithTooltip({
  inputId,
  label,
  tooltip
}: {
  inputId: string
  label?: string
  tooltip?: string
}) {
  return (
    <div className="flex">
      {label && (
        <label htmlFor={inputId} className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </label>
      )}

      <Tooltip tooltip={tooltip} />
    </div>
  )
}
