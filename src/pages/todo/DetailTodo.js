import * as React from 'react';
import { useRef, useEffect } from "react";
import { 
  Box, 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  FormControl, 
  FormLabel,
  FormControlLabel,
  Switch,  
  TextField,
} from "@mui/material";

import StarterKit from "@tiptap/starter-kit";
import {
  MenuButtonBold,
  MenuButtonItalic,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditor,
} from "mui-tiptap";

import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from "date-fns";

import { useDispatch } from 'react-redux';
import { updateTodo } from '../../redux/todo/actions';
import { useAuth } from '../../context/AuthContext';
import './todo.css'

export default function DetailTodo({ editId, todos, open, handleClose }) {
  const dispatch = useDispatch();
  const editorRef = useRef(null);

  const [title, setTitle] = React.useState("");
  const [titleError, setTitleError] = React.useState(false);
  const [titleErrorMessage, setTitleErrorMessage] = React.useState('');

  const [description, setDescription] = React.useState("");
  const [descriptionError, setDescriptionError] = React.useState(false);
  const [descriptionErrorMessage, setDescriptionErrorMessage] = React.useState('');

  const [status, setStatus] = React.useState(true);
  const [dueDate, setDuedate] = React.useState(dayjs( new Date().toISOString().split("T")[0] ));

  const { user } = useAuth();
  const [todo, setTodo] = React.useState({});

  
  useEffect(() => {
    setTodo(todos[editId])
  }, [editId, todos]);


  useEffect(() => {
    setTitle(todo?.title);
    setDescription(todo?.description);
    setStatus(todo?.status);
    const date = todo?.due_date? new Date(todo?.due_date) : new Date();
    setDuedate(dayjs( date.toISOString().split("T")[0] ))
  }, [todo]);
  

  const removeHtmlTags = (str) => {
    let cleanedStr = str?.replace(/<\/?[^>]+(>|$)/g, "");
    cleanedStr = cleanedStr?.replace(/\n/g, "");
    return cleanedStr;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const validate = validateInputs();

    if(validate == false)
      return;
    if ( titleError || descriptionError) {
      return;
    }

    const formattedDate = format(dueDate, "yyyy-MM-dd");

    dispatch(updateTodo({ id: todo?.id, title, description, status, dueDate: formattedDate, user_id: user?.uuid }));
    handleClose();
  };

  const validateInputs = () => {
    let isValid = true;
    if (!title|| title.trim() =="") {
      setTitleError(true);
      setTitleErrorMessage('Please enter title.');
      isValid = false;
    } else {
      setTitleError(false);
      setTitleErrorMessage('');
    }

    const descriptionPlainText = removeHtmlTags(description);
    if (!descriptionPlainText|| descriptionPlainText.trim() =="") {
      setDescriptionError(true);
      setDescriptionErrorMessage('Please enter description.');
      isValid = false;
    } else {
      setDescriptionError(false);
      setDescriptionErrorMessage('');
    }
    return isValid;
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: (event) => {
          event.preventDefault();
          handleSubmit(event);
        },
        sx: { backgroundImage: 'none' },
      }}
      fullWidth={true}
      maxWidth={"md"}
    >
      <DialogTitle>Edit Todo </DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
      >
        <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="title">Title</FormLabel>
              <TextField
                error={titleError}
                helperText={titleErrorMessage}
                type="text"
                placeholder="Please enter title"
                autoComplete=""
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={titleError ? 'error' : 'primary'}
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Description</FormLabel>
              {
                description?
                  <RichTextEditor
                    ref={editorRef}
                    extensions={[StarterKit]} // Or any Tiptap extensions you wish!
                    content={description} // Initial content for the editor
                    style={{ height: "100px", overflowY: "auto", maxHeight:"100px", minHeight: "100px"  }}
                    renderControls={() => (
                      <MenuControlsContainer>
                        <MenuSelectHeading />
                        <MenuDivider />
                        <MenuButtonBold />
                        <MenuButtonItalic />
                      </MenuControlsContainer>
                    )}
                    onUpdate={({ editor }) => {
                      setDescription(editor.getHTML()); // Get HTML content
                    }}
                  >
                  </RichTextEditor>
                :
                  <RichTextEditor
                    ref={editorRef}
                    extensions={[StarterKit]} // Or any Tiptap extensions you wish!
                    content="" // Initial content for the editor
                    style={{ height: "100px", overflowY: "auto", maxHeight:"100px", minHeight: "100px"  }}
                    renderControls={() => (
                      <MenuControlsContainer>
                        <MenuSelectHeading />
                        <MenuDivider />
                        <MenuButtonBold />
                        <MenuButtonItalic />
                      </MenuControlsContainer>
                    )}
                    onUpdate={({ editor }) => {
                      setDescription(editor.getHTML()); // Get HTML content
                    }}
                  >
                  </RichTextEditor>
              }
              
              {descriptionError && <p style={{ color: "red", marginTop: "5px" }}>{descriptionErrorMessage}</p>}
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="status">Status</FormLabel>
              <FormControlLabel
                control={<Switch checked={status} onChange={(e)=>setStatus(e.target.checked)} />}
                label={status ? "On" : "Off"}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="dueDate">Due Date</FormLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker', 'DatePicker']}>
                    <DatePicker
                      label="Controlled picker"
                      value={dueDate}
                      renderInput={(props) => <TextField {...props} />}
                      onChange={(newValue) => setDuedate(newValue)}
                    />
                  </DemoContainer>
                </LocalizationProvider>
            </FormControl>
          </Box>
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" type="submit">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
