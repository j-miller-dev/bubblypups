import React, { useState } from "react";
import FsLightbox from "fslightbox-react";

function Gallery() {
    const [lightboxController, setLightboxController] = useState({
        toggler: false,
        slide: 1,
    });

    const images = [
        "/images/gallery/502319044_17994059882802840_6920213472963083229_n.jpg",
        "/images/gallery/503311336_17992260032802840_39200220785251235_n.jpg",
        "/images/gallery/508686865_17993965757802840_5635872540663735746_n.jpg",
        "/images/gallery/510963167_17994499958802840_2001308436729847384_n.jpg",
        "/images/gallery/511532996_17994821429802840_3900949975547190294_n.jpg",
        "/images/gallery/511543675_17994714224802840_1330681720326907512_n.jpg",
        "/images/gallery/514762367_17995274594802840_2649849391708338813_n.jpg",
        "/images/gallery/524300714_17997925667802840_4367928199535474911_n.jpg",
        "/images/gallery/549825573_18004075493802840_4005890969860040822_n.jpg",
    ];

    const openLightboxOnSlide = (index) => {
        setLightboxController({
            toggler: !lightboxController.toggler,
            slide: index + 1,
        });
    };

    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                        Our Work
                    </h2>
                    <p className="mt-6 text-lg text-gray-600">
                        See some of our recent grooming transformations
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer"
                            onClick={() => openLightboxOnSlide(index)}
                        >
                            <img
                                src={image}
                                alt={`Gallery image ${index + 1}`}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                        </div>
                    ))}
                </div>
            </div>

            <FsLightbox
                toggler={lightboxController.toggler}
                sources={images}
                slide={lightboxController.slide}
            />
        </div>
    );
}

export default Gallery;
