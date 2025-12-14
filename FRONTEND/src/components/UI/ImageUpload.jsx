import React from "react";
import { UploadCloud } from "lucide-react";

const ImageUpload = ({ label = "Image", value = "", onFileChange, mode = "add" }) => {
  return (
    <div>
      <h3 className="block text-xs font-medium text-gray-500 mb-1 ml-1">{label}</h3>

      <label className="block">
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="hidden"
          disabled={mode === "view"}
        />
        <div
          className={`border-2 border-dashed border-gray-200 rounded-xl p-8 transition-colors hover:border-primary hover:bg-primary/5 group ${mode === "view" ? "" : "cursor-pointer"} relative overflow-hidden`}
        >
          {value ? (
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                <img src={value} alt="Preview" className="w-full h-full object-contain bg-gray-50" />
              </div>
              <p className="text-sm text-gray-500">Click to replace image</p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-3 group-hover:scale-110 transition-transform">
                <UploadCloud size={24} />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                Click to upload <span className="font-normal text-gray-500">or drag and drop</span>
              </h4>
              <p className="text-xs text-gray-400 mb-4">SVG, PNG, JPG or GIF (max. 800x400px)</p>
              {mode === "view" ? (
                <div className="px-4 py-2 bg-gray-200 text-sm font-medium rounded-lg inline-block">No image</div>
              ) : (
                <div className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary_hover inline-block">Browse files</div>
              )}
            </div>
          )}
        </div>
      </label>
    </div>
  );
};

export default ImageUpload;
