import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../configs/firebase';
import { doc, getDoc } from 'firebase/firestore';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, 'product', id);
        const productSnapshot = await getDoc(productRef);
        if (productSnapshot.exists()) {
          setProduct({ id: productSnapshot.id, ...productSnapshot.data() });
        } else {
          setError('Product not found');
        }
      } catch (error) {
        setError('Error fetching product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!product) {
    return <p>Product not found</p>;
  }
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#4d5377'
    }}>
    <Link
     to="http://localhost:5173"
        style={{
        marginBottom: '20px',
        color: 'white',
        textShadow: '0 0 2px black',
        textDecoration: 'none', // optional: removes underline
    }}
>
  Back
    </Link>
      <div style={{
        padding: '20px',
        border: '5px solid #000',
        borderRadius: '5px',
        backgroundColor: '#ffad23',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <h1>Product Detail</h1>
        <div>
          {product.product_img && (
            <img
              src={product.product_img}
              alt="Product Image"
              style={{ maxWidth: '200px', margin: '0 auto 10px', border: '1px solid #000' }}
            />
          )}
          <p>{product.product_name}</p>
          <p>{product.product_description}</p>
          <p>Price: ${product.product_price}</p>
          <p>Quantity: {product.product_quantity}</p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
