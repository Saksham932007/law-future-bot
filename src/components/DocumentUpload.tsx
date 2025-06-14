
import { useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface DocumentUploadProps {
  onFileSelect: (file: File, content: string) => void;
  disabled?: boolean;
}

export const DocumentUpload = ({ onFileSelect, disabled }: DocumentUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFileRead = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileSelect(file, content);
    };
    reader.onerror = () => {
      toast({
        title: "Error",
        description: "Failed to read the file. Please try again.",
        variant: "destructive"
      });
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select a file smaller than 5MB.",
          variant: "destructive"
        });
        return;
      }
      
      if (!file.type.includes('text') && !file.name.endsWith('.txt') && !file.name.endsWith('.md')) {
        toast({
          title: "Unsupported file type",
          description: "Please upload a text document (.txt, .md, or other text files).",
          variant: "destructive"
        });
        return;
      }
      
      handleFileRead(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 5MB.",
          variant: "destructive"
        });
        return;
      }
      handleFileRead(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="relative">
      <input
        type="file"
        onChange={handleFileChange}
        accept=".txt,.md,.doc,.docx,text/*"
        className="hidden"
        id="document-upload"
        disabled={disabled}
      />
      <label htmlFor="document-upload">
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className="bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-300 h-14 px-6 rounded-2xl font-medium"
          asChild
        >
          <div className="cursor-pointer">
            <Upload className="h-5 w-5 mr-2" />
            Upload Document
          </div>
        </Button>
      </label>
      
      {/* Drag & Drop Overlay */}
      {isDragging && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-dashed border-cyan-400 rounded-3xl p-12 text-center">
            <Upload className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
            <p className="text-xl font-semibold text-white mb-2">Drop your document here</p>
            <p className="text-slate-400">We'll review it with AI assistance</p>
          </div>
        </div>
      )}
    </div>
  );
};
