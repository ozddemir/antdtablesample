import React, { useState, useEffect } from 'react'

import { Table, Spin } from 'antd';
import 'antd/dist/antd.css';
export const AntdTable = () => {
    //Tabla için kullanılacak ürünlerin serverdan çekilmesi biraz zaman alır. Bu yüzden loading usestate ile dataların gelmesi beklenir
    const [loading, setLoading] = useState(true);

    // Api den çekeceğimiz ürünleri atamasını yapacağımız null bir usestate oluşturduk
    const [products, setProducts] = useState(null)


    // Tabloda string ve int için sort methodu
    const antdtablesorter = (a, b, key) => {
        if (typeof a[key] === 'number' && typeof b[key] === 'number') {
            return a[key] - b[key]
        }

        if (typeof a[key] === 'string' && typeof b[key] === 'string') {
            a = a[key].toLowerCase();
            b = b[key].toLowerCase();
            return a > b ? -1 : b > a ? 1 : 0;
        }
        return
    }

    //tablo için filter fonksiyonu
    const antdtablefilter = (value, record) => {
        const res = record.title.includes(value);
        return res;
    }

    // fakestoreapi'den tabloda kullanılacak dataların çekilmesi için kullanılacak olan fonksiyon.
    const getdata = async () => {
        fetch('https://fakestoreapi.com/products')
            .then(res => res.json())
            .then(json => {
                //console.log(json)
                //Api den gelen ürün bilgisi setProducts ile products usestate'ine atanır
                setProducts(json)
                //Sayfa, api den data gelene kadar loading ekranında kalır. data alındıktan sonra loading usestate false olur ve table kullanıcıya gösterilir
                setLoading(false)
            })
    }

    //Data sadece sayfaya ilk girişte çekilmesi için useeffect kullanıldı
    useEffect(() => {
        getdata();
    }, [])

    //Tablo kolonlarının başlık ve içeriği. dataIndex değişkeninde belirlenen isim ile gelen json datada ki değişken isimleri ile aynı olmasına dikkat edilmesi gerekir.
    const columns = [

        {
            title: 'ID',
            dataIndex: 'id',
            sorter: (a, b) => antdtablesorter(a, b, "id"),
            render: id => <h3>{id}</h3>,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            filters: [
                { text: 'Jacket', value: 'Jacket' },

                { text: 'SSD', value: 'SSD' },
            ],
            onFilter: (value, record) => antdtablefilter(value, record),
            render: title => <h3>{title}</h3>,

        },
        {
            title: 'price',
            dataIndex: 'price',
            sorter: (a, b) => antdtablesorter(a, b, "price"),
            render: price => <h3>{price}$</h3>,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            render: description => <>{description}</>,
            width: "30%",
        },
        {
            dataIndex: 'image',
            render: image => <div className="wrapper"><img src={`${image}`} alt="product" /> </div>,
        },

    ];
    return (
        <>
            {/* loading usestate false olana kadar tablo kullanıcıya gösterilmiyor */}
            {
                loading === false ? (
                    <Table rowKey="_id" columns={columns} dataSource={products} />)
                    :
                    <Spin tip="Loading...">
                    </Spin>
            }
        </>
    )
}
