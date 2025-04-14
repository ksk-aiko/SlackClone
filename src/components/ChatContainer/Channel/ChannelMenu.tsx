/**
 * ChannelMenu component provides a menu for editing or deleting a channel.
 * 
 * @component
 * @param {string} channelId - The unique identifier of the channel.
 * @param {string} channelName - The current name of the channel.
 * 
 * @returns {JSX.Element} The rendered ChannelMenu component.
 * 
 * @example
 * <ChannelMenu channelId="123" channelName="general" />
 * 
 * @remarks
 * This component uses Material-UI for the UI elements and Redux for state management.
 * 
 * @function
 * @name handleEdit
 * @description Dispatches an action to update the channel name and closes the edit dialog.
 * 
 * @function
 * @name handleDelete
 * @description Dispatches an action to delete the channel and closes the delete dialog.
 * 
 * @function
 * @name setAnchorEl
 * @description Sets the anchor element for the menu.
 * 
 * @function
 * @name setEditDialogOpen
 * @description Controls the visibility of the edit dialog.
 * 
 * @function
 * @name setDeleteDialogOpen
 * @description Controls the visibility of the delete dialog.
 * 
 * @function
 * @name setNewChannelName
 * @description Updates the new channel name state.
 */

import React, { FC, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  updateChannelAsync,
  deleteChannelAsync,
} from "../../../features/channel/channelSlice";

interface ChannelMenuProps {
  channelId: string;
  channelName: string;
}

export const ChannelMenu: FC<ChannelMenuProps> = ({
  channelId,
  channelName,
}) => {

  // Initialize the dispatch function and state variables.
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState(channelName);

  // Function to handle the opening of the menu.
  const handleEdit = () => {
    dispatch(updateChannelAsync({ channelId, name: newChannelName }));
    setEditDialogOpen(false);
    setAnchorEl(null);
  };

  // Function to handle the deletion of a channel.
  const handleDelete = () => {
    dispatch(deleteChannelAsync(channelId));
    setDeleteDialogOpen(false);
    setAnchorEl(null);
  };

  // Render the menu with edit and delete options.
  return (
    <>
      <Button
        onClick={(e) => setAnchorEl(e.currentTarget)}
        aria-label="channel menu"
        sx={{ minWidth: "auto", padding: "4px" }}
      >
        ⋮
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => setEditDialogOpen(true)}>Edit</MenuItem>
        <MenuItem onClick={() => setDeleteDialogOpen(true)}>Delete</MenuItem>
      </Menu>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Channel Name</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Channel Name"
            fullWidth
            value={newChannelName}
            onChange={(e) => setNewChannelName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEdit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Channel</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the "{channelName}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
