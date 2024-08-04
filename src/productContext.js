import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import data from './products.json';


const productContext = createContext();


const useValue = () =>{
    const value = useContext(productContext);
    return value;
}


const CustomProductProvider = ({children}) => {

    //INPUT FOR SEARCH RESULT
    const [input, setInput] = useState("");

    //STORING THE PRODUCT DATA ON FILTER
    const [productData, setProductData] = useState([]);
    
    //FOR THE PRICE FILTER BAR
    const [filterValue, setFilterValue] = useState(50000);

    //FOR THE CATEGORY FILTER 
    const [categoryFilter, setCategoryFilter] = useState("");

    //TOGGLE THE FILTER
    const [toggle, setToggle] = useState(true);


      //HANDLING SEARCH RESULT BY SEARCHING A PRODUCT IN THE SEARCH ICON
    const renderDataOnSearch = (value) =>{
        setInput(value);
       if(input !== ''){
       const filteredData = data.filter((d)=> d.product.toLowerCase().includes(input.toLowerCase()));
       setProductData(filteredData);
       }
    }

     useEffect(()=>{
        const filteredData = data.filter((d)=> Number(d.price) >= Number(filterValue));
        setProductData(filteredData);
     }, [filterValue]);

     // FILTERING THE PRODUCTS BASED ON THE PRODUCT TAGS AND TOGGLING THE PRODUCTS BASED ON TOGGLE
     const filterFunctionality= (value) =>{
        toggle ? setToggle(false) : setToggle(true);
        if(toggle){
         setCategoryFilter(value);
        }else{
         setProductData(data);
        }
     }
     
     useEffect(()=> {
        const filteredData = data.filter((d)=> d.category === categoryFilter);
        setProductData(filteredData);
     }, [categoryFilter]);

     // FETCHING THE PRODUCTS ON MOUNT
     useEffect(()=>{
        setProductData(data);
    }, []);

    return (
        <productContext.Provider value={{input, 
        setInput, productData, renderDataOnSearch, filterValue, 
        setFilterValue, setCategoryFilter, filterFunctionality}}>
            {children}
        </productContext.Provider>
    )

  } 

export {productContext, useValue};
export default CustomProductProvider;