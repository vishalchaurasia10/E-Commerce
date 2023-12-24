import Announcement from './components/layout/Announcement'
import Footer from './components/layout/Footer'
import Navbar from './components/layout/Navbar'
import AuthState from './context/Auth/AuthState'
import CartState from './context/Cart/CartState'
import FeaturedState from './context/FeaturedProducts/FeaturedState'
import ProductState from './context/Products/ProductState'
import SearchState from './context/search/SearchState'
import { Roboto, Bebas_Neue, Jost } from 'next/font/google'
import './globals.css'

export const roboto = Roboto({
  weight: ['300', '400', '500', '700', '900'],
  subsets: ['latin'],
})

export const bebas_neue = Bebas_Neue({
  weight: ['400'],
  subsets: ['latin'],
})

export const jost = Jost({
  subsets: ['latin'],
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${roboto.className}`}>
        <AuthState>
          <SearchState>
            <ProductState>
              <FeaturedState>
                <CartState>
                  <Announcement />
                  <Navbar />
                  {children}
                  <Footer />
                </CartState >
              </FeaturedState>
            </ProductState>
          </SearchState>
        </AuthState>
      </body>
    </html>
  )
}
