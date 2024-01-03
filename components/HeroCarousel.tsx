"use client"

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Image from "next/image";

const heroImages = [
    {
        imageUrl: "/assets/test.jpg",
        alt: "desert"
    },
    {
        imageUrl: "/assets/test.jpg",
        alt: "desert"
    },
    {
        imageUrl: "/assets/test.jpg",
        alt: "desert"
    },
    {
        imageUrl: "/assets/test.jpg",
        alt: "desert"
    },
    {
        imageUrl: "/assets/test.jpg",
        alt: "desert"
    },

]
const HeroCarousel = () => {
    return (
        <div className=" flex justify-center">
            <Carousel width={800} showThumbs={false} autoPlay infiniteLoop interval={2000} showArrows={false} showStatus={false}>
                {heroImages.map((image, index) => (
                    <Image  key={index} width={400} height={484} src={image.imageUrl} alt={image.alt} />
                ))}
            </Carousel>
        </div>

    )
}

export default HeroCarousel
