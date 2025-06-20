import { Dispatch, SetStateAction } from 'react';

export interface AvatarUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
  selectedFile: File | null;
  setSelectedFile: Dispatch<SetStateAction<File | null>>;
  uploadProgress: number;
  isUploading: boolean;
}
