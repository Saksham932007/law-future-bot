import { useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface DocumentUploadProps {
  onFileSelect: (file: File, content: string, metadata?: DocumentMetadata) => void;
  disabled?: boolean;
}

interface DocumentMetadata {
  pageCount?: number;
  fileType: string;
  wordCount: number;
  documentType: string;
}

export const DocumentUpload = ({ onFileSelect, disabled }: DocumentUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const detectDocumentType = (content: string, fileName: string): string => {
    const lowerContent = content.toLowerCase();
    const lowerFileName = fileName.toLowerCase();
    
    if (lowerContent.includes('agreement') || lowerContent.includes('contract') || 
        lowerFileName.includes('contract') || lowerFileName.includes('agreement')) {
      return 'contract';
    }
    if (lowerContent.includes('policy') || lowerFileName.includes('policy')) {
      return 'policy';
    }
    if (lowerContent.includes('lease') || lowerFileName.includes('lease')) {
      return 'lease';
    }
    if (lowerContent.includes('nda') || lowerContent.includes('non-disclosure') ||
        lowerFileName.includes('nda')) {
      return 'nda';
    }
    if (lowerContent.includes('terms of service') || lowerContent.includes('terms and conditions')) {
      return 'terms';
    }
    if (lowerContent.includes('whereas') && lowerContent.includes('party')) {
      return 'legal-document';
    }
    
    return 'general';
  };

  const handlePDFRead = async (file: File) => {
    try {
      setIsProcessing(true);
      console.log('Starting PDF read for file:', file.name);
      const arrayBuffer = await file.arrayBuffer();
      console.log('ArrayBuffer created, size:', arrayBuffer.byteLength);
      
      // Import pdfjs-dist
      const pdfjsLib = await import('pdfjs-dist');
      
      // Use a more reliable worker setup - inline worker as fallback
      try {
        // Try to use the bundled worker first
        const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.min.js');
        pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker.default;
      } catch (workerError) {
        console.log('Bundled worker failed, using inline worker');
        // Fallback to inline worker if CDN fails
        pdfjsLib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(
          new Blob([`
            importScripts('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js');
          `], { type: 'application/javascript' })
        );
      }
      
      console.log('PDF.js worker configured successfully');
      
      const pdf = await pdfjsLib.getDocument({ 
        data: arrayBuffer,
        verbosity: 0 // Reduce console noise
      }).promise;
      console.log('PDF loaded, pages:', pdf.numPages);
      
      let fullText = '';
      
      // Extract text from all pages with progress
      for (let i = 1; i <= pdf.numPages; i++) {
        try {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .filter((item: any) => item.str && item.str.trim())
            .map((item: any) => item.str)
            .join(' ');
          fullText += pageText + '\n';
          
          // Show progress for large PDFs
          if (pdf.numPages > 5) {
            console.log(`Processing page ${i} of ${pdf.numPages}`);
          }
        } catch (pageError) {
          console.warn(`Failed to process page ${i}:`, pageError);
          // Continue with other pages
        }
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
      
      const wordCount = fullText.trim().split(/\s+/).filter(word => word.length > 0).length;
      const documentType = detectDocumentType(fullText, file.name);
      
      const metadata: DocumentMetadata = {
        pageCount: pdf.numPages,
        fileType: 'pdf',
        wordCount,
        documentType
      };
      
      onFileSelect(file, fullText.trim(), metadata);
      
      toast({
        title: "PDF processed successfully",
        description: `Extracted text from ${pdf.numPages} pages (${wordCount} words). Document type: ${documentType}`,
      });
    } catch (error) {
      console.error('PDF parsing error:', error);
      toast({
        title: "Error",
        description: "Failed to read the PDF file. Please try a different PDF or convert it to text format.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextFileRead = (file: File) => {
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const wordCount = content.trim().split(/\s+/).length;
      const documentType = detectDocumentType(content, file.name);
      
      const metadata: DocumentMetadata = {
        fileType: 'text',
        wordCount,
        documentType
      };
      
      onFileSelect(file, content, metadata);
      setIsProcessing(false);
    };
    reader.onerror = () => {
      toast({
        title: "Error",
        description: "Failed to read the file. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
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
        disabled={disabled || isProcessing}
      />
      <label htmlFor="document-upload">
        <Button
          type="button"
          variant="outline"
          disabled={disabled || isProcessing}
          className="bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-300 h-14 px-6 rounded-2xl font-medium"
          asChild
        >
          <div className="cursor-pointer">
            <Upload className="h-5 w-5 mr-2" />
            {isProcessing ? 'Processing...' : 'Upload Document'}
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
            <p className="text-slate-400">We'll analyze PDF and text files with AI assistance</p>
          </div>
        </div>
      )}
      
      {/* Processing Indicator */}
      {isProcessing && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
          <div className="bg-slate-800 rounded-xl p-4 flex items-center space-x-3">
            <div className="animate-spin h-5 w-5 border-2 border-cyan-400 border-t-transparent rounded-full"></div>
            <span className="text-white text-sm">Processing document...</span>
          </div>
        </div>
      )}
    </div>
  );
};
