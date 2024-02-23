import React, { useEffect, useState } from 'react';
import { useListContext } from '../../context/Context';
import axios from 'axios';
import { BASE_URL } from '../../utils/const';
import md5 from 'md5';

export default function MainPage() {
    const [product, setProduct] = useState([]);
    const { productList, getList } = useListContext();
    const [currentPage, setCurrentPage] = useState(1);
    const limitPerPage = 50;


    const generateXAuth = () => {
        const password = 'Valantis';
        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const xAuth = md5(`${password}_${timestamp}`);
        return xAuth;
    };

    async function getProduct(productList) {
        try {
            const xAuth = generateXAuth();
            const requestData = {
                action: "get_items",
                params: { "ids": productList }
            };

            const response = await axios.post(
                `${BASE_URL}`,
                requestData,
                {
                    headers: {
                        'X-Auth': xAuth,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const uniqueProducts = response.data.result.filter((product, index, self) =>
                index === self.findIndex((p) => (
                    p.product === product.product
                ))
            );

            setProduct(uniqueProducts);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const nextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    useEffect(() => {
        getList((currentPage - 1) * limitPerPage, limitPerPage);
    }, [currentPage]);

    useEffect(() => {
        getProduct(productList);
    }, [productList]);


    return (
        <div>
            {product.map((item, index) => (
                <div key={index}>
                    <span>{item.brand}</span>
                    <span>{item.price}</span>
                    <span>{item.product}</span>
                </div>
            ))}
            <button onClick={prevPage} type='submit'>Previous</button>
            <button onClick={nextPage} type='submit'>Next</button>
        </div>
    );
}
