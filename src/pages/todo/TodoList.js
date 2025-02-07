import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  AppBar,
  Box,
  Button,
  ButtonGroup,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Toolbar,
  Typography
  } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

import AddTodo from './AddTodo';
import DetailTodo from './DetailTodo';
import { fetchTodos, deleteTodo } from '../../redux/todo/actions';

import { useAuth } from '../../context/AuthContext';

function truncateString(description, size) {
  if (description.length > size) {
    return description.slice(0, size) + "...";
  }
  return description;
}

const removeHtmlTags = (str) => {
  let cleanedStr = str?.replace(/<\/?[^>]+(>|$)/g, "");
  cleanedStr = cleanedStr?.replace(/\n/g, "");
  return cleanedStr;
};

const columns = [
  { id: 'id', align: 'center', label: 'ID', minWidth: 30 },
  { id: 'title', align: 'center', label: 'Title', minWidth: 70, format: (value) => truncateString(removeHtmlTags(value), 30)  },
  { id: 'description', align: 'left', label: 'Description', minWidth: 70, format: (value) => truncateString(removeHtmlTags(value), 30) },
  { id: 'status', align: 'center', label: 'Status', minWidth: 50, format: (value) => value? "On" : "Off" },
  { id: 'due_date', align: 'center', label: 'DueDate', minWidth: 50 },
];

const drawerWidth = 240;

function TodoList(props) {
  const { window } = props;
  const { logout, user } = useAuth();
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos);

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [addOpen, setAddOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [editId, setEditId] = React.useState("");
 
  useEffect(() => {
    dispatch(fetchTodos(user?.uuid));
  }, [dispatch]);

  const handleClickAddOpen = () => {
    setAddOpen(true);
  };

  const handleClose = () => {
    setAddOpen(false);
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const removeTodo = (e, id) => {
    e.preventDefault();
    dispatch(deleteTodo(id));
  };

  const editTodo = (e, id) => {
    e.preventDefault();
    setEditId(id);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };
  
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        HIRING TASK
      </Typography>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: 'center' }}>
            <Button sx={{ color: '#fff' }} onClick={logout}>
              Logout
            </Button>
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            HIRING TASK
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Button sx={{ color: '#fff' }} onClick={logout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box component="main" sx={{ p: 3, margin: '0 auto' }} textAlign={'center'} >
        <Toolbar />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 1,
            m: 1,
            bgcolor: 'background.paper',
            borderRadius: 1,
          }}
        >
          <Button variant="contained" onClick={handleClickAddOpen} >
            Add todo
          </Button>
        </Box>
        <TableContainer sx={{ maxHeight: 650, width:1200 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
               <TableCell
                  align={"center"}
                  style={{ minWidth: 100 }}
                >
                </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {todos?.todos
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow hover tabIndex={-1} key={index}>
                    {columns.map((column, columnIndex) => {
                      var value = "";
                      if(column.id == "id")
                        value = (index + 1);
                      else
                        value = row[column.id];
                      return (
                        <TableCell align={column.align} key={columnIndex}>
                          {column.format
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                      <TableCell
                        align={"center"}
                        style={{ minWidth: 100 }}
                      >
                        <ButtonGroup size="small" aria-label="Small button group">
                          <IconButton aria-label="edit" color="success" onClick={(e)=>editTodo(e, index)}>
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton aria-label="delete" color="error" onClick={(e)=>removeTodo(e, row["id"])}>
                            <RemoveCircleIcon />
                          </IconButton>
                          
                        </ButtonGroup>
                      </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={todos?.todos.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      </Box>

      <AddTodo open={addOpen} handleClose={handleClose} />
      <DetailTodo editId={editId} todos={todos?.todos} open={editOpen} handleClose={handleEditClose} />
    </Box>
  );
}

TodoList.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default TodoList;