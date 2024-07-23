// import { useState } from 'react'
import styles from '../filter/filter.module.css'
import { useValue } from '../../productContext'

export const Filter = () =>{

    const {filterValue, setFilterValue, filterFunctionality} = useValue();

    
    return (
        <div className={styles.filterContainer}>
         <form className={styles.formContainer}>
            <h2 className={styles.names}>Filter</h2>
            <span className={styles.pricing}>Price starts from: {filterValue}</span>
            <input 
            type='range' 
            min='1' max='100000' step='10' value={filterValue} 
            className={styles.rangeInput}
            onChange={(e)=> setFilterValue(e.target.value)}/>
            <h2 className={styles.names}>Category</h2>
            <div className={styles.categoryContainer}>
                <div className={styles.categoryElements}>
                <input type="checkbox" name="mensfashion" id="mensfashion" className={styles.checkBox} 
                onClick={(e)=> filterFunctionality(e.target.name)}/>
                <label htmlFor="mensfashion" className={styles.labels}>Men's Fashion</label>
                </div>
                <div className={styles.categoryElements}>
                <input type="checkbox" name="womensfashion" id="womensfashion" className={styles.checkBox} 
                onClick={(e)=> filterFunctionality(e.target.name)}/>
                <label htmlFor="womensfashion" className={styles.labels}>Women's Fashion</label>
                </div>
                <div className={styles.categoryElements}>
                <input type="checkbox" name="jewellery" id="jewellery" className={styles.checkBox}
                onClick={(e)=> filterFunctionality(e.target.name) }/>
                <label htmlFor="jewellery" className={styles.labels}>Jewellery</label>
                </div>
                <div className={styles.categoryElements}>
                <input type="checkbox" name="electronics" id="electronics" className={styles.checkBox}
                onClick={(e)=> filterFunctionality(e.target.name) }/>
                <label htmlFor="electronics" className={styles.labels}>Electronics</label>
                </div>
            </div>
         </form>
        </div>
    )
}