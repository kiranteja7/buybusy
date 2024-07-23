// import { useState } from "react"
import styles from '../search/search.module.css'
import { useValue } from "../../productContext";


export const Search = () =>{

    const {input, renderDataOnSearch} = useValue();

    return(

    <div className={styles.searchContainer}>
        <input placeholder="Search By Name" 
        onChange={(e)=> renderDataOnSearch(e.target.value)} 
        value={input} 
        className={styles.input}>

        </input>
    </div>
    )
}