import { Link, useNavigate } from 'react-router-dom';
import styles from './signIn.module.css';
import { useValue } from '../../productContext';

export const SignIn = () =>{

    const {user, setUser, handleSignIn} = useValue();
    const navigate = useNavigate();

    return (
        <>
        <form method='get' action='/signin' onSubmit={(e)=> {handleSignIn(e); navigate('/')}}>
         <div className={styles.container}>
            <div className={styles.card}>
                <span className={styles.span}>Sign In</span>
                <input className={styles.input} 
                placeholder='Enter Email'
                value={user.email} 
                onChange={(e)=> setUser({email: e.target.value, password: user.password})}
                ></input>
                <input className={styles.input} 
                placeholder='Enter Password'
                value={user.password} 
                onChange={(e)=> setUser({email: user.email, password: e.target.value})}
                ></input>
                <button className={styles.button} type={'submit'}>Sign In</button>
                <Link to={`/register`}><span className={styles.downSpan}>Or SignUp Instead</span></Link>
            </div>
         </div>
         </form>
        </>
    )
}