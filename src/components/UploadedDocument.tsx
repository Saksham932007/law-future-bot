
import { FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface UploadedDocumentProps {
  fileName: string;
  fileSize: number;
  onRemove: () => void;
}

export const UploadedDocument = ({ fileName, fileSize, onRemove }: UploadedDocumentProps) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex items-center justify-between bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 rounded-2xl p-4 mb-4"
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-white font-medium text-sm">{fileName}</p>
          <p className="text-slate-400 text-xs">{formatFileSize(fileSize)}</p>
        </div>
      </div>
      <Button
        onClick={onRemove}
        variant="ghost"
        size="sm"
        className="text-slate-400 hover:text-white hover:bg-slate-700/50 h-8 w-8 p-0 rounded-xl"
      >
        <X className="h-4 w-4" />
      </Button>
    </motion.div>
  );
};
