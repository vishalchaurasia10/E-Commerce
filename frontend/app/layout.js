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
import CartNotification from './components/layout/CartNotification'
import Script from 'next/script'

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
        <Script id="meta-pixel-script" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1234202434674429');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img height="1" width="1" style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1234202434674429&ev=PageView&noscript=1"
          />
        </noscript>
        <AuthState>
          <SearchState>
            <ProductState>
              <FeaturedState>
                <CartState>
                  <Announcement />
                  <Navbar />
                  <CartNotification />
                  {children}
                  <Footer />
                </CartState>
              </FeaturedState>
            </ProductState>
          </SearchState>
        </AuthState>
      </body>
    </html>
  )
}