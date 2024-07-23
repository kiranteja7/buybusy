import { Cards } from "../../components/cards/cards"
import { Filter } from "../../components/filter/filter"
import { Search } from "../../components/search/search"
import { useValue } from "../../productContext"
import styles from '../Home/Home.module.css'

export const Home = () =>{

    const {productData} = useValue();
    return (
        <>
       <Search/>
       <div className={styles.bodyContainer}>
          <div className={styles.filterContainer}> <Filter/></div>
          <div className={styles.cardsContainer}>
          {productData.map((d, i)=> (
            <Cards d={d} cartPage={false} key={i}/>
          ))}
          </div>
       </div>
       </>
    )
}