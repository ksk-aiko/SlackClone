/**
 * MessageMenu component provides a menu with options to edit or delete a message.
 * 
 * @component
 * @example
 * const messageId = "12345";
 * const messageText = "Hello, world!";
 * return <MessageMenu messageId={messageId} messageText={messageText} />;
 * 
 * @param {Object} props - Component props
 * @param {string} props.messageId - The ID of the message
 * @param {string} props.messageText - The text of the message
 * 
 * @returns {JSX.Element} The rendered MessageMenu component
 */

import { React, FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  Menu, 
  MenuItem, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  Button 
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { updateMessageAsync, deleteMessageAsync } from '../../../features/message/messageSlice.ts';

interface MessageMenuProps {
  messageId: string;
  messageText: string;
}

export const MessageMenu: FC<MessageMenuProps> = ({ messageId, messageText }) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newMessageText, setNewMessageText] = useState(messageText);

  const handleEdit = () => {
    dispatch(updateMessageAsync({ messageId, text: newMessageText }));
    setEditDialogOpen(false);
    setAnchorEl(null);
  };

  const handleDelete = () => {
    dispatch(deleteMessageAsync(messageId));
    setDeleteDialogOpen(false);
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        size="small"
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => setEditDialogOpen(true)}>Edit</MenuItem>
        <MenuItem onClick={() => setDeleteDialogOpen(true)}>Delete</MenuItem>
      </Menu>

      {/* Edit Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit message</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            multiline
            rows={4}
            margin="dense"
            fullWidth
            value={newMessageText}
            onChange={(e) => setNewMessageText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>キャンセル</Button>
          <Button onClick={handleEdit} variant="contained" color="primary">
            save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Deletion confirmation dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Deleting Messages</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this message?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};