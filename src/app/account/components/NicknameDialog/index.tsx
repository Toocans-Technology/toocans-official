import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material';
import { Cancel as CancelIcon } from '@mui/icons-material';

interface NicknameDialogProps {
  open: boolean;
  onClose: () => void;
  currentNickname: string;
  onSave: (newNickname: string) => Promise<void>;
  isUpdating: boolean;
}

export const NicknameDialog = ({
  open,
  onClose,
  currentNickname,
  onSave,
  isUpdating,
}: NicknameDialogProps) => {
  const [newNickname, setNewNickname] = useState(currentNickname);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!newNickname.trim()) {
      setError('Nickname cannot be empty');
      return;
    }
    await onSave(newNickname.trim());
  };

  const handleClose = () => {
    setNewNickname(currentNickname);
    setError('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      sx={{
        '& .MuiDialog-paper': { backgroundColor: 'white' },
        color: '#000',
      }}
    >
      <IconButton
        aria-label="close"
        onClick={handleClose}
        disabled={isUpdating}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: '#999',
          '&:hover': {
            backgroundColor: 'transparent',
          },
        }}
      >
        <CancelIcon />
      </IconButton>
      <DialogTitle sx={{ color: '#000', pt: 5 }}>Change Nickname</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nickname"
          type="text"
          fullWidth
          variant="outlined"
          value={newNickname}
          onChange={(e) => {
            setNewNickname(e.target.value);
            if (error) setError('');
          }}
          error={!!error}
          helperText={error}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: 'flex-end', gap: 1 }}>
        <Button
          onClick={handleClose}
          disabled={isUpdating}
          sx={{
            textTransform: 'none',
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'transparent',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          sx={{
            bgcolor: "#9CFF1F",
            color: "#000",
            "&:hover": {
              bgcolor: "#8CE60F"
            },
            "&.Mui-disabled": {
              bgcolor: "#E0E0E0",
              color: "#9E9E9E"
            },
            padding: '8px 20px',
          }}
          onClick={handleSave}
          variant="contained"
          disabled={isUpdating || !newNickname.trim() || newNickname === currentNickname}
        >
          {isUpdating ? 'Updating...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NicknameDialog;
