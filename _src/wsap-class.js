function createGallery(maybeGallery, isLightbox){
    var galleryElem = maybeGallery;
    if(!galleryElem){
        //If an id was passed in, try to use it for retrieving element
        if(typeof galleryElem === "string"){ galleryElem = document.getElementById(galleryElem); }

        console.log("No gallery element passed in, and couldn't find gallery by an id.");
        // If there is no gallery abort this function
        return false;
    }
    
    galleryElem.className += wsap.classes.galleryBlock;

    //Capture info of new slideshow for lightbox
    let newSliderInfo = {
        // Holds element reference
        el : null,
        // Starts at slide one
        current: 1,
        allImgs: [],
        navDots: []
    }


    let newSlideshow;
    // If this slideshow will be in a lightbox
    if(isLightbox){
        // Create new div for slideshow
        newSlideshow = document.createElement('div');
        newSlideshow.className += (" " + wsap.classes.lightboxSlideshow);
        newSlideshow.style.display = "none";
    } else {
        // Build slideshow in current element
        newSlideshow = galleryElem;
    }

    //Create div to wrap nav dots
    let navDots = document.createElement('div');
    navDots.className += " dot-nav";
    
    // I honestly forget why I did it like this. No idea.
    let slideshowIndex = initializedSlideshows.length + 1;
    addNavArrows(slideshowIndex, newSlideshow);

    // Holds lightbox slideshow images
    let slideImgBlock = document.createElement('div');
    slideImgBlock.className = (" " + wsap.classes.slideshowImgBlock);
    //Capture all img elements in gallery element,
    //spread them into an array for iteration                
    let images = [...galleryElem.getElementsByTagName('img')];
    for(var imgIndex = 0; imgIndex<images.length; imgIndex++){

        let img = images[imgIndex];
        let galleryIndex = imgIndex + 1;
        
        // Wrap image in div for easier styling
        const newSlide = createSlide(img);
        //Create new nav dot for new image
        const newDot = createNavDot(slideshowIndex, galleryIndex);
        // Add both to slideshow
        newSliderInfo['allImgs'].push(newSlide);
        newSliderInfo['navDots'].push(newDot);
        slideImgBlock.appendChild(newSlide);
        navDots.appendChild(newDot);

        // Appends a picture type class for styling(if needed)       
        let h = img.height;
        let w = img.width;
        if(h > w){ img.className += (" " + wsap.classes.portraitImg); }
        else { img.className += (" " + wsap.classes.landscapeImg); }

        // If slider will be in a lightbox, instead of built where it is
        if(isLightbox){
            // Creates an 'a' element with background set to image(or thumb)
            const newGalleryImg = createGalleryImage(img, slideshowIndex, galleryIndex);
            //Appends replacement anchor to original gallery element
            galleryElem.appendChild(newGalleryImg);
        }   
    }

    //Add all created slideshow parts
    newSlideshow.appendChild(slideImgBlock);
    newSlideshow.appendChild(navDots);

    // Stores reference to slideshow element
    newSliderInfo['el'] = newSlideshow;
    //Push info onto list of made slideshows
    initializedSlideshows.push(newSliderInfo);

    // If slideshow is going into the lightbox
    if(isLightbox){
        getOverlay().appendChild(newSlideshow);
    } else {
    // Otherwise, display the first image
        showSlide(slideshowIndex, 1);
    }
}