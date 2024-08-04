import styles from './register.module.css'
// import { useValue } from '../../productContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { handleUsersSignUpAsync } from '../../redux/reducers/userReducer';
import { toast } from 'react-toastify';

export const Register = () =>{

    // const {user, setUser, handleSignUp} = useValue();
    const navigate = useNavigate();
    const [user, setUser] = useState({email:"", password:"", name:""});
    const dispatch = useDispatch();
    const handleSignUp = (e) =>{
        e.preventDefault();
        dispatch(handleUsersSignUpAsync(user));
        navigate('/')
        toast.success("User created successfully!");
    }

    return (
        <>
        <form action='/register' method='get' onSubmit={(e)=> {handleSignUp(e)}}>
         <div className={styles.container}>
            <div className={styles.card}>
                <span className={styles.span}>Sign Up</span>
                <input className={styles.input} 
                placeholder='Enter Name' 
                value={user.name} 
                onChange={(e)=> setUser({name: e.target.value, password: user.password, email: user.email})}></input>
                <input className={styles.input} 
                placeholder='Enter Email' 
                value={user.email} 
                onChange={(e)=> setUser({name: user.name, password: user.password,  email: e.target.value})}></input>
                <input className={styles.input} 
                placeholder='Enter Password' 
                type='password'
                value={user.password} 
                onChange={(e)=> setUser({name: user.name, password: e.target.value,  email: user.email})}></input>
                <button type={'submit'} className={styles.button}>Sign Up</button>
            </div>
         </div>
         </form>
        </>
    )
}