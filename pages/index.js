import { useState } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

import products from '../products.json'
import { initiateCheckout } from '../lib/payments'

const defaultCart = {
  products: {}
}

export default function Home() {

  const [cart, updateCart] = useState(defaultCart)

  const cartItems = Object.keys(cart.products).map(key => {
    const product = products.find(({ id }) => `${id}` === `${key}`)
    return {
      ...cart.products[key],
      pricePerItem: product.price
    }
  })

  const subtotal = cartItems.reduce((accumulator, { pricePerItem, quantity }) => {
    return accumulator + (pricePerItem * quantity)
  }, 0)

  const totalItems = cartItems.reduce((accumulator, { quantity }) => {
    return accumulator + quantity
  }, 0)

  const addToCart = ({ id } = {}) => {
    updateCart(prev => {
      let cartState = {...prev}

      if (cartState.products[id]) {
        cartState.products[id].quantity = cartState.products[id].quantity + 1
      } else {
        cartState.products[id] = {
          id, 
          quantity: 1
        }
      }
      return cartState
      })
    }

    const checkout = () => {
      initiateCheckout({
        lineItems: cartItems.map(item => {
          return {
            price: item.id,
            quantity: item.quantity
          }
        })
      })
    }


  return (
    <div className={styles.container}>
      <Head>
        <title>Space Jelly Shop</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          The Lorem Ipsum Shop
        </h1>

        <p>
          <strong>Items:</strong> {totalItems}
          <br />
          <strong>Total Cost:</strong> ${subtotal}
          <br/>
          <button className={styles.button} onClick={checkout}>Check Out</button>
        </p>

        <ul className={styles.grid}>
          {products.map((product) => {
            const {id, title, image, description, price} = product
            return (
              <li key={id} className={styles.card}>
                <a href="#">
                  <img src={image} alt={title} />
                  <h3>{title}</h3>
                  <p>${price}</p>
                  <p>{description}</p>
                </a>
                <button 
                  className={styles.button}
                  onClick={() => 
                    addToCart({
                      id
                    })
                }
                >Add to Cart</button>
              </li>
            )
          })}
        </ul>
      </main>
    </div>
  )
}
