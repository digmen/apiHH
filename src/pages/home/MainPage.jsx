import React, { useEffect, useState } from 'react';
import { useListContext } from '../../context/Context';
import axios from 'axios';
import { BASE_URL } from '../../utils/const';
import md5 from 'md5';

export default function MainPage() {
    const [product, setProduct] = useState([]);
    const { productList, getList } = useListContext();
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const limitPerPage = 50;
    const [priceFilter, setPriceFilter] = useState('');
    const [brandFilter, setBrandFilter] = useState('');
    const [nameFilter, setNameFilter] = useState('');

    const generateXAuth = () => {
        const password = 'Valantis';
        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const xAuth = md5(`${password}_${timestamp}`);
        return xAuth;
    };

    async function getProduct(productList) {
        try {
            setLoading(true);
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

            setProduct(response.data.result);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    async function getProductPrice() {
        try {
            setLoading(true);
            setNameFilter('')
            setBrandFilter('')
            const xAuth = generateXAuth();
            const requestData = {
                action: "filter",
                params: { "price": parseFloat(priceFilter), "offset": 0, "limit": 50 }
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
            if (response) {
                const requestDataFilter = {
                    action: "get_items",
                    params: { "ids": response.data.result }
                };
                const responseFilter = await axios.post(
                    `${BASE_URL}`,
                    requestDataFilter,
                    {
                        headers: {
                            'X-Auth': xAuth,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                setProduct(responseFilter.data.result);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    async function getProductBrand(brandFilter) {
        try {
            setLoading(true);
            setNameFilter('')
            setPriceFilter('')
            const xAuth = generateXAuth();
            const requestData = {
                action: "filter",
                params: { "brand": brandFilter, "offset": 0, "limit": 50 }

            };
            const response = await axios.post(
                `${BASE_URL}`,
                requestData,
                {
                    headers: {
                        'X-Auth': xAuth,
                        'Content-Type': 'application/json',
                    }
                }
            );
            if (response) {
                const requestDataFilter = {
                    action: "get_items",
                    params: { "ids": response.data.result }
                };
                const responseFilter = await axios.post(
                    `${BASE_URL}`,
                    requestDataFilter,
                    {
                        headers: {
                            'X-Auth': xAuth,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                setProduct(responseFilter.data.result);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    async function getProductName(nameFilter) {
        try {
            setLoading(true);
            setPriceFilter('')
            setBrandFilter('')
            const xAuth = generateXAuth();
            const requestData = {
                action: "filter",
                params: { "product": nameFilter, "offset": 0, "limit": 50 }
            };
            const response = await axios.post(
                `${BASE_URL}`,
                requestData,
                {
                    headers: {
                        'X-Auth': xAuth,
                        'Content-Type': 'application/json',
                    }
                }
            );
            if (response) {
                const requestDataFilter = {
                    action: "get_items",
                    params: { "ids": response.data.result }
                };
                const responseFilter = await axios.post(
                    `${BASE_URL}`,
                    requestDataFilter,
                    {
                        headers: {
                            'X-Auth': xAuth,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                setProduct(responseFilter.data.result);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    const nextPage = () => {
        setPriceFilter('')
        setNameFilter('')
        setBrandFilter('')
        setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        setPriceFilter('')
        setNameFilter('')
        setBrandFilter('')
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
        <div className='container'>
            <div className='table'>
                <div><h1>Если нет данных перезагрузите страницу</h1></div>
                {loading ? (
                    <div className='container_loader'>
                        <svg viewBox="25 25 50 50">
                            <circle r="20" cy="50" cx="50"></circle>
                        </svg>
                    </div>
                ) : (
                    <>
                        <div className='form'>
                            <form onSubmit={(e) => e.preventDefault()}>
                                <input
                                    type="text"
                                    value={priceFilter}
                                    placeholder="Поиск по цене"
                                    onChange={(event) => setPriceFilter(event.target.value)}
                                />
                                <button type='submit' onClick={getProductPrice}>Поиск</button>

                            </form>
                            <form onSubmit={(e) => e.preventDefault()}>
                                <input
                                    type="text"
                                    value={brandFilter}
                                    placeholder="Поиск по бренду"
                                    onChange={(event) => setBrandFilter(event.target.value)}
                                />
                                <button type='submit' onClick={() => getProductBrand(brandFilter)}>Поиск</button>
                            </form>
                            <form onSubmit={(e) => e.preventDefault()}>
                                <input
                                    type="text"
                                    value={nameFilter}
                                    placeholder="Поиск по названию"
                                    onChange={(event) => setNameFilter(event.target.value)}
                                />
                                <button type='submit' onClick={() => getProductName(nameFilter)}>Поиск</button>
                            </form>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>id</th>
                                    <th>Название</th>
                                    <th>Цена</th>
                                    <th>Бренд</th>
                                </tr>
                            </thead>
                            <tbody>
                                {product.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.id}</td>
                                        <td>{item.product}</td>
                                        <td>{item.price}</td>
                                        <td>{item.brand == null ? <span className='red'>Неизвестно</span> : `${item.brand}`}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
                <div className='btn'>
                    <button onClick={prevPage} type='submit'>Предыдущая</button>
                    <span style={{ backgroundColor: '#faead6', padding: '7px', borderRadius: "6px" }}>Страница: {currentPage}</span>
                    <button onClick={nextPage} type='submit'>Следущая</button>
                </div>
            </div>
            <a href='https://github.com/digmen/apiHH'>Сылка на GitHub</a>
        </div>
    );
}
