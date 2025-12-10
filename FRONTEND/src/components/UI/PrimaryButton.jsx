import React from 'react'

const PrimaryButton = ({ title, type = "button", className, props, children }) => {
  return (
    <button
        { ...props }
        type={type}
        className={`w-full bg-[#6C63FF] hover:bg-[#5a52d5] text-white font-semibold py-2 px-4 rounded-full cursor-pointer transition-colors duration-200 shadow-lg shadow-indigo-500/30 mt-4 ${className}`}
    >
        { children }
        { title }
    </button>
  )
}

export default PrimaryButton