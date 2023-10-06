import React from 'react'

const Category = () => {
    const categories = [
        {
            title: 'Shop Women',
            imgUrl: '',
            url: '/categories/women'
        },
        {
            title: 'Shop Men',
            imgUrl: '',
            url: '/categories/men'
        },
        {
            title: 'Zodiac Signs',
            imgUrl: '',
            url: '/categories/zodiac-signs'
        },
        {
            title: 'Fitness',
            imgUrl: '',
            url: '/categories/fitness'
        },
        {
            title: 'Travel',
            imgUrl: '',
            url: '/categories/travel'
        },
        {
            title: 'Halloween',
            imgUrl: '',
            url: '/categories/halloween'
        }
    ]
    return (
        <div className='categoriesThumbnail'>
            {categories.map((category, index) => {
                return (
                    <div key={index} className='categoryThumbnail'>
                        <img src={category.imgUrl} alt={category.title} />
                        <h3>{category.title}</h3>
                    </div>
                )
            })}
        </div>
    )
}

export default Category
