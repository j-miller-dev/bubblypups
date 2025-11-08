import React, { useState } from "react";
import FsLightbox from "fslightbox-react";

function Gallery() {
    // To open the lightbox change the value of the "toggler" prop.
    const [toggler, setToggler] = useState(false);

    return (
        <>
            <button onClick={() => setToggler(!toggler)}>
                Toggle Lightbox
            </button>
            <FsLightbox
                toggler={toggler}
                sources={[
                    "https://www.instagram.com/bubblypupsgrooming/p/DOr-6GJEep2/",
                    "https://www.instagram.com/bubblypupsgrooming/p/DMeWmuqzHrh/",
                    "https://www.instagram.com/bubblypupsgrooming/p/DLggpTmTQAv/",
                ]}
            />
        </>
    );
}

export default Gallery;
