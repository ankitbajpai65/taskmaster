import React, { useState, useEffect } from 'react'
import {
    Button,
    Grid,
    Card,
    CardActions,
    CardContent,
    Typography,
    IconButton,
    Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import BasicModal from '../Modal/BasicModal';
import { useNavigate } from 'react-router-dom';
import baseUrl from "../../../config";
import './Home.css'
import homeImg from '/login.png'

const Home = ({
    userData,
    filteredTodos,
    getAllTodos,
    openDrawer,
    activeDrawerButton,
    inputSearch
}) => {
    const isLogin = localStorage.getItem("isLogin");

    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [todo, setTodo] = useState({
        title: "",
        description: ""
    });

    const redirectToLogin = () => {
        navigate('/login');
    }

    const handleOpen = () => setOpen(true);

    const handleClose = () => {
        setOpen(false);
        setIsEditing(false)
        setTodo({
            title: '',
            description: ''
        })
    }

    useEffect(() => {
        if (userData?._id) {
            getAllTodos()
        }
    }, [userData]);

    const editBtnClick = (todoToEdit) => {
        handleOpen();
        setIsEditing(true);

        setTodo({
            id: todoToEdit._id,
            title: todoToEdit.title,
            description: todoToEdit.description,
        })
    }

    const handleEditTodo = (e) => {
        e.preventDefault();
        fetch(`${baseUrl}/todo/editTodo`, {
            method: "PATCH",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(todo)
        })
            .then((res) => {
                let result = res.json();
                return result;
            }).then((data) => {
                getAllTodos();
            })
        handleClose();
    }

    const handleDeleteTodo = (id) => {
        const confirmation = confirm('Do you want to delete this todo?')

        if (confirmation) {
            fetch(`${baseUrl}/todo/deleteTodo`, {
                method: "PATCH",
                crossDomain: true,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ id })
            })
                .then((res) => res.json()).then((data) => {
                    getAllTodos();
                })
        }
    }

    const handleRestoreTodo = (id) => {
        const confirmation = confirm('Do you want to restore this todo?')

        if (confirmation) {
            fetch(`${baseUrl}/todo/restoreTodo`, {
                method: "PATCH",
                crossDomain: true,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ id })
            })
                .then((res) => res.json()).then((data) => {
                    getAllTodos();
                })
        }
    }

    const handleDeleteTodoPermanently = (id) => {
        const confirmation = confirm('Are you sure you want to delete this todo permanently!')

        if (confirmation) {
            fetch(`${baseUrl}/todo/deleteTodoPermanently`, {
                method: "DELETE",
                crossDomain: true,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ id })
            })
                .then((res) => res.json()).then((data) => {
                    getAllTodos();
                })
        }
    }

    const handleEmptyTrash = () => {
        console.log(`empty trasg clicks`);
        console.log(userData)

        const confirmation = confirm('Do you want to empty your trash?')

        if (confirmation) {
            fetch(`${baseUrl}/todo/emptyTrash`, {
                method: "DELETE",
                crossDomain: true,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ id: userData._id })
            })
                .then((res) => res.json()).then((data) => {
                    getAllTodos();
                })
        }
    }

    return (
        <>
            {
                !isLogin ?
                    <Grid container className="homeDiv"
                        sx={{ height: '91vh' }}>
                        <Grid item md={6} className="homeImgCont">
                            <img src={homeImg} alt="" />
                        </Grid>
                        <Grid item xs={12} md={6} className="homeInfo">
                            <h1 className="message1">Welcome to the Taskmaster</h1>
                            <h2 className="message2">Unlock the full potential by logging in to add and view your todos.</h2>
                            <Button variant="contained" sx={{ mt: 2 }} onClick={redirectToLogin} className="myBtn">Login</Button>
                        </Grid>
                    </Grid>
                    :
                    <div className={`${openDrawer && window.innerWidth > 768 ? 'homeMainContainer mainContainer' : 'homeMainContainer'}`}
                    >
                        {
                            (activeDrawerButton === '' || activeDrawerButton === 'Todos') &&
                            <button className="addBtn" onClick={handleOpen}>
                                <AddIcon className='addIcon' />
                            </button>
                        }
                        <BasicModal
                            open={open}
                            handleClose={handleClose}
                            todo={todo}
                            setTodo={setTodo}
                            getAllTodos={getAllTodos}
                            isEditing={isEditing}
                            setIsEditing={setIsEditing}
                            handleEditTodo={handleEditTodo}
                            userData={userData}
                        />
                        {
                            activeDrawerButton === 'Trash' &&
                            <div className='trashMessageContainer'>
                                <Typography variant="span" sx={{ mr: 3 }}>
                                    Todos in Trash are deleted after 7 days
                                </Typography>
                                <Button
                                    variant="text"
                                    className="emptyTrashBtn"
                                    onClick={handleEmptyTrash}
                                >
                                    Empty trash
                                </Button>

                            </div>
                        }
                        <Grid
                            container
                            spacing={5}
                            className={`cardContainer ${filteredTodos?.length === 0 ? 'emptyCardContainer' : 'filledCardContainer'}`}>
                            {
                                filteredTodos?.length > 0 ? (
                                    filteredTodos.map((todo, index) => (
                                        <Grid item xs={12} sm={6} md={4} xl={3} key={index}
                                            sx={{ height: 'fit-content' }}
                                        >
                                            <Card
                                                sx={{
                                                    width: '100%',
                                                    position: 'relative',
                                                    background: 'var(--primary-20)',
                                                    boxShadow: 'none'
                                                }}
                                                className="cards"
                                                key={index}
                                            >
                                                <CardContent>
                                                    <Typography variant="h5" component="div" sx={{ mb: 3 }}>
                                                        {todo.title}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ mb: 3 }}>
                                                        {todo.description}
                                                    </Typography>
                                                </CardContent>
                                                <CardActions sx={{
                                                    position: 'absolute',
                                                    right: '0rem',
                                                    bottom: '0rem'
                                                }}>
                                                    {
                                                        (activeDrawerButton === 'Todos' || activeDrawerButton === '') &&
                                                        <>
                                                            <IconButton
                                                                aria-label="delete"
                                                                onClick={() => editBtnClick(todo)}
                                                            >
                                                                <EditIcon />
                                                            </IconButton>
                                                            <IconButton
                                                                aria-label="delete"
                                                                onClick={() => handleDeleteTodo(todo._id)}
                                                            >
                                                                <DeleteIcon className='deleteIcon' />
                                                            </IconButton>
                                                        </>
                                                    }
                                                    {
                                                        activeDrawerButton === 'Trash' &&
                                                        <>
                                                            <Tooltip title="Restore">
                                                                <IconButton
                                                                    aria-label="restore"
                                                                    onClick={() => handleRestoreTodo(todo._id)}
                                                                >
                                                                    <RestoreFromTrashIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Delete forever">
                                                                <IconButton
                                                                    aria-label="delete"
                                                                    onClick={() => handleDeleteTodoPermanently(todo._id)}
                                                                >
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </>
                                                    }

                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    ))
                                ) : (
                                    <Grid item xs={12} sx={{
                                        display: "flex",
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        color: 'var(--primary-30)',
                                        textAlign: 'center'
                                    }}>
                                        {activeDrawerButton === 'Trash' ? (
                                            <div className='emptyTrashContainer'>
                                                <DeleteOutlineIcon className='trashIcon' />
                                                <Typography variant="h4" id="message">
                                                    Trash is empty
                                                </Typography>
                                            </div>
                                        ) : (
                                            inputSearch?.length > 0 ? (
                                                <h1>No todo found</h1>
                                            ) : (
                                                <>
                                                    <Typography variant="h3" component="div" className="emptyMessage" sx={{ mb: 3, fontWeight: 'bold' }}>
                                                        Your todo list is empty.
                                                    </Typography>
                                                    <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
                                                        Add some todos to get started.
                                                    </Typography>
                                                </>
                                            )
                                        )}
                                    </Grid>

                                )
                            }
                        </Grid>
                    </div>
            }
        </>
    )
}

export default Home