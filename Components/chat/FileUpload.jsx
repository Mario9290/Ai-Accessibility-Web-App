import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Camera, Image } from "lucide-react";

export default function FileUpload({ onFileUpload }) {
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div className="flex justify-center space-x-4">
        <Button
          onClick={handleUploadClick}
          className="btn-primary flex-1 h-16 rounded-2xl flex flex-col items-center justify-center space-y-1"
        >
          <Upload className="w-6 h-6" />
          <span className="text-sm">Upload File</span>
        </Button>
        
        <Button
          onClick={() => {
            fileInputRef.current.setAttribute('capture', 'environment');
            fileInputRef.current.click();
          }}
          className="btn-primary flex-1 h-16 rounded-2xl flex flex-col items-center justify-center space-y-1"
        >
          <Camera className="w-6 h-6" />
          <span className="text-sm">Take Photo</span>
        </Button>
      </div>
      
      <p className="text-sm text-gray-600 text-center">
        Share a screenshot or photo of what you need help with
      </p>
    </div>
  );
}