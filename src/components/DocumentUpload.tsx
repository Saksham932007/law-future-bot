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

  const handlePDFRead = async (file: File) => {
    try {
      console.log('Starting PDF read for file:', file.name);
      const arrayBuffer = await file.arrayBuffer();
      console.log('ArrayBuffer created, size:', arrayBuffer.byteLength);
      
      // Import pdfjs-dist for browser compatibility
      const pdfjsLib = await import('pdfjs-dist');
      
      // Set up the worker
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
      
      console.log('PDF.js imported successfully');
      
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      console.log('PDF loaded, pages:', pdf.numPages);
      
      let fullText = '';
      
      // Extract text from all pages
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .filter((item: any) => item.str)
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }
      
      console.log('PDF parsed successfully, text length:', fullText.length);
      
      if (!fullText || fullText.trim().length === 0) {
        toast({
          title: "Warning",
          description: "PDF appears to be empty or contains only images. Please try a text-based PDF.",
          variant: "destructive"
        });
        return;
      }
      
      onFileSelect(file, fullText.trim());
    } catch (error) {
      console.error('PDF parsing error:', error);
      toast({
        title: "Error",
        description: "Failed to read the PDF file. Please try a different PDF or convert it to text format.",
        variant: "destructive"
      });
    }
  };

  const handleTextFileRead = (file: File) => {
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
      if (file.size > 10 * 1024 * 1024) { // Increased to 10MB for PDFs
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB.",
          variant: "destructive"
        });
        return;
      }
      
      if (file.type === 'application/pdf') {
        handlePDFRead(file);
      } else if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        handleTextFileRead(file);
      } else {
        toast({
          title: "Unsupported file type",
          description: "Please upload a PDF, text document (.txt, .md, or other text files).",
          variant: "destructive"
        });
        return;
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB.",
          variant: "destructive"
        });
        return;
      }
      
      if (file.type === 'application/pdf') {
        handlePDFRead(file);
      } else if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        handleTextFileRead(file);
      } else {
        toast({
          title: "Unsupported file type",
          description: "Please upload a PDF, text document (.txt, .md, or other text files).",
          variant: "destructive"
        });
      }
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
        accept=".txt,.md,.pdf,text/*,application/pdf"
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
            <p className="text-slate-400">We'll review PDF and text files with AI assistance</p>
          </div>
        </div>
      )}
    </div>
  );
};
