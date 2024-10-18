import React, { useEffect, useState } from 'react';

import styles from "../../styles/Admin.module.css";
import { useDispatch, useSelector } from 'react-redux';
import { url } from '../../utils/constants';
import { createProduct, deleteProduct, updateProduct } from '../../features/products/productsSlice';
import { removeItemFromCart } from '../../features/user/userSlice';

const Admin = () => {

    const dispatch = useDispatch();
    
    const products = useSelector((state) => state.products);
    
    const [currentProduct, setCurrentProduct] = useState({});

    const [oldTitle, setOldTitle] = useState("");
    const [file, setFile] = useState(null);
    
    const [values, setValues] = useState({
        title: "",
        price: 0,
        description: "",
        categoryId: 0,
        
    });


    
    

    const handleChange = ({ target: { value, name, } }) => {
        setValues({ ...values, [name]: value });
    };

    const selectFile = e => {
        setFile(e.target.files[0]);
    }

    const handleClick = (id) => {
        const item = products.list.find((i) => i.id === id);
        
        if (item) {
            setOldTitle(item.title);
            setValues({
                title: item.title,
                price: item.price,
                description: item.description,
                categoryId: item.categories.id,
                
            });
        }
    };

    

    const removeItem = (id) => {
        console.log(id.id);
        dispatch(removeItemFromCart(id))
        dispatch(deleteProduct(id));
    }


    const handleCreate = (event) => {
        event.preventDefault();
        dispatch(createProduct({...values, file}));
    }
    
    const handleUpdate = (event) => {
        event.preventDefault();
        dispatch(updateProduct({...values, oldTitle: oldTitle, file}));
    }

    return (
        <>
            <section className={styles.profile}>
            
                <form className={styles.form}>
                    <div className={styles.group}>
                        <input
                        type="text"
                        placeholder="Title"
                        name="title"
                        value={values.title}
                        autoComplete="off"
                        onChange={handleChange}
                        required
                        />
                    </div>

                    <div className={styles.group}>
                        <input
                        type="text"
                        placeholder="Description"
                        name="description"
                        value={values.description}
                        autoComplete="off"
                        onChange={handleChange}
                        required
                        />
                    </div>

                    <div className={styles.group}>
                        <input
                        type="number"
                        placeholder="Price"
                        name="price"
                        value={values.price}
                        autoComplete="off"
                        onChange={handleChange}
                        required
                        />
                    </div>


                    <div className={styles.group}>
                        <input
                        type="number"
                        placeholder="CategoryId"
                        name="categoryId"
                        value={values.categoryId}
                        autoComplete="off"
                        onChange={handleChange}
                        required
                        />
                    </div>
                    
                    <div className={styles.group}>
                        <input
                        type="file"
                        placeholder="Picture"
                        name="image"
                        autoComplete="off"
                        onChange={selectFile}
                        required
                        />
                    </div>
                

                    <button type="submit" className={styles.submit} onClick={handleUpdate}>
                        Update
                    </button>
                    <button type="submit" className={styles.submit} onClick={handleCreate}>
                        Create
                    </button>
                </form>
            
            </section>


            <section className={styles.cart}>
                <div className={styles.list}>
                    {products.list.slice().reverse().map((item) => {
                        const {title, description ,categories: {name}, image, price, id} = item
                        return (
                            <div className={styles.item} key={id} onClick={() => handleClick(id)}>
                                <div className={styles.image}
                                style={{backgroundImage: `url(${url}/${image})`}}/>
                                <div className={styles.info}>
                                    <div className={styles.name}>{title}</div>
                                    <div className={styles.category}>{name}</div>
                                </div>
                                <div className={styles.price}>{description}</div>
                                <div className={styles.price}>{price}BYN</div>
                               

                                <div className={styles.close} onClick={() => removeItem(item)}>
                                        <svg className="icon">
                                            <use
                                                xlinkHref={`${process.env.PUBLIC_URL}/sprite.svg#close`}
                                            />
                                        </svg>
                                </div>
                            </div>
                        )
                    })}
                </div>

               
                
           
            </section>
        </>
    );
}

export default Admin;