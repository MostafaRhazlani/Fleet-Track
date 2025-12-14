import React from 'react'

const PrimaryButton = ({ title, type = "button", className, children, onClick }) => {
  return (
    <button
        onClick={onClick}
        type={type}
        className={`min-w-40 bg-primary hover:bg-primary_hover text-white font-semibold py-2 px-4 rounded-full cursor-pointer transition-colors duration-200 ${className}`}
    >
        { children }
        { title }
    </button>
  )
}

export default PrimaryButton