export interface NicknameDialogProps {
  open: boolean;
  onClose: () => void;
  currentNickname: string;
  onSave: (newNickname: string) => Promise<void>;
  isUpdating: boolean;
}
