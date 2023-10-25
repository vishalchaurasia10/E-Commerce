import { Roboto, Bebas_Neue, Jost } from 'next/font/google'

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