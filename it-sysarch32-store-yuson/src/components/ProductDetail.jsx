import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../configs/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { loadStripe } from '@stripe/stripe-js';

// Load the Stripe.js library with your publishable API key
const stripePromise = loadStripe('pk_test_51PF6bH01HQKgGVcfVkd34lorJUmKppG8lJS29V1Vw53ygbWGZgfRikcpkru8xaPDCs1qZUIoRJV2yEYnX44P10Ba00KGmZj2AD'); // Replace with your publishable key

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleClick = async ( productName, price) => {
    const stripe = await stripePromise;

    // Send a request to the backend to create a checkout session
    const response = await fetch('http://localhost:4000/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productName, price }), // Send product name and price to the backend
    });

    if (response.ok) {
      // If the request is successful, retrieve the session ID from the response
      const session = await response.json();

      // Redirect the user to the Stripe Checkout page using the session ID
      const result = await stripe.redirectToCheckout({ sessionId: session.id });

      if (result.error) {
        // If there is an error during the redirect, display the error message
        setError(result.error.message);
      }
    } else {
      // If there is an error creating the checkout session, display an error message
      setError('Error creating checkout session');
    }
  };

  // Handle the change event when the user enters a product name
  const handleProductNameChange = (event) => {
    setProductName(event.target.value);
  };

  // Handle the change event when the user enters a price
  const handlePriceChange = (event) => {
    setPrice(event.target.value * 100); // Convert price to cents for Stripe
  };

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
          <button style={{
              backgroundColor: '#3ac569',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
              marginTop: '20px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }} onClick={() => handleClick(product.product_name, product.product_price*100)}>Checkout</button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
