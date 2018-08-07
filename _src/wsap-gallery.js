const wsap = {

    // General options
    options: {
        // Nav dots in lightbox
        'dots' : false,
        closeBtnHTML: '<span class="wsap-x-bar"></span><span class="wsap-x-bar"></span>',

        // Options to load thumbnails for gallery(not required)
        thumbs: {
            prefix: 't-',
            suffix: '',
            ext: 'jpg'
        },
    
    }, // End options

    // Class reference
    classes: {
        galleryWrapper: 'wsap-gallery',
        lightboxOverlay: " ezee-lightbox-overlay",
        closeLighboxBtn: ' close-lightbox-btn',
        xBtnBar: 'wsap-btn-bar',
        navArrow: 'wsap-nav-arrow',

        lightboxSlideshow: 'ezee-lightbox-slideshow',
        landscapeImg: 'landscape-img',
        portraitImg: 'portrait-img',
        slideshowImgBlock: 'slideshow-img-block',
        slideshowSlide: 'slideshow-slide slide-effect-fade',
        slideshowDot: 'slideshow-dot',
        nextArrow: 'next-slide-btn',
        prevArrow: 'prev-slide-btn'
    },


    /* =================
        Code begin
    ==================== */
    // Data
    initializedSlideshows: initializedSlideshows,
    
    // Functions
    initStuff: initStuff,
    buildThumbUrl: buildThumbUrl,
    createGallery: createGallery,
    getOverlay: getOverlay,
    navSlides: navSlides,
    showSlide: showSlide,
    showLightbox: showLightbox,
    closeLightbox: closeLightbox,

    addNavArrows: addNavArrows
};



//Holds info for all slideshows
const initializedSlideshows = [
    /*{
        elem: slideShowElement
        current: 1,
        allImgs: [],
        navDots
    },*/
];


function initStuff(){

    //Check for slideshows and initialize
    // Slideshows are essentially inline lightboxes
    const slideshows = [...document.getElementsByClassName('ezee-slideshow')];
    if(slideshows.length){
        for(let s = 0; s< slideshows.length; s++){
            createGallery(slideshows[s]);
        }
    }

    //Check for galleries and initialize
    const galleries = [...document.getElementsByClassName('wsap-gallery')];
    if(galleries.length){
        for(let g = 0; g< galleries.length; g++){
            createGallery(galleries[g], true);
        }
    }
}

function setSrcToData(imgEl, galleryEl, options){
    let galleryUrl;
    if(options && options.thumbs) {
        galleryUrl = wsap.buildThumbUrl(imgEl, options.thumbs);
    } else {
        galleryUrl = (imgEl.dataset.src || imgEl.getAttribute('src'));
    }

    setTimeout(()=>{
        // In case this is an inline slideshow
        if(galleryEl){
            imgEl.onload = ()=>{ 
                galleryEl.style.backgroundSize = "cover";
                galleryEl.style.backgroundImage = "url('" + galleryUrl + "')";
            }
        }

        // Checks for src in dataset
        setTimeout(() => {
            if(imgEl.dataset.src){
                imgEl.src = imgEl.dataset.src;
            }    
        }, 1);
    }, 1);
}

// Handles gallery generation
function createGallery(maybeGallery, isLightbox){
    var galleryElem = maybeGallery;
    if(!galleryElem){
        //If an id was passed in, try to use it for retrieving element
        if(typeof galleryElem === "string"){ galleryElem = document.getElementById(galleryElem); }

        console.log("No gallery element passed in, and couldn't find gallery by an id.");
        // If there is no gallery abort this function
        return false;
    }
    
    galleryElem.className += ( " " + wsap.classes.galleryWrapper);

    //Capture info of new slideshow for lightbox
    let newSliderInfo = {
        // Holds element reference
        el : null,
        // Starts at slide one
        current: 1,
        allImgs: [],
        navDots: []
    }

    let newSlideshow = galleryElem;

    // If this slideshow will be in a lightbox
    if(isLightbox){
        //New lightbox slideshow div
        newSlideshow = document.createElement('div');
        newSlideshow.className += (" " + wsap.classes.lightboxSlideshow);
        newSlideshow.style.display = "none";
    }

    //Create div to wrap nav dots
    let navDots = document.createElement('div');
    navDots.className += " dot-nav";
    
    //Captures what will be the index of slideshow being built
    let slideshowIndex = initializedSlideshows.length + 1;

    wsap.addNavArrows(slideshowIndex, newSlideshow);

    //Block of lightbox slideshow images
    let slideImgBlock = document.createElement('div');
    slideImgBlock.className = (" " + wsap.classes.slideshowImgBlock);
    slideImgBlock.addEventListener('click', closeLightbox);

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

        if(isLightbox){
            // Creates an 'a' element with background set to image
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

function createGalleryImage(img, slideshowIndex, galleryIndex){
    //*****Create a new anchor element to take the place of img element
    const newGalleryImg = document.createElement('a');
    newGalleryImg.setAttribute('href', '#');
    newGalleryImg.className += " gallery-img";
    newGalleryImg.style.backgroundSize = "20px";
    newGalleryImg.style.backgroundImage = "url('" + loadingGif + "')";
                    
    // Sets images for slideshow and gallery
    setSrcToData(img, newGalleryImg, wsap.options);

    // Add link to slideshow pic on click
    newGalleryImg.addEventListener('click', (e)=>{
        e.preventDefault();
        showLightbox(slideshowIndex, galleryIndex)
    });

    return newGalleryImg;
}

function createSlide(img){
    //Wrap images in slideshow-styling div's
    const newSlide = document.createElement('div');
    newSlide.className += (" " + wsap.classes.slideshowSlide);
    newSlide.appendChild(img);
    return newSlide;
}

function createNavDot(slideshowIndex, galleryIndex){
    const newDot = document.createElement('span');
    newDot.className += (" " + wsap.classes.slideshowDot);
    newDot.addEventListener('click', ()=>{
        showSlide(slideshowIndex, galleryIndex);
    });
    return newDot;
}

function addNavArrows(slideshowIndex, newSlideshow){
    // TODO
    // for(let i = 0; i < 2; i++){
    //     let navArrow = document.createElement('a');
    //     navArrow.className += (" " + wsap.classes.navArrow);
    //     navArrow.innerHTML = (i ? "&#10095;" : "&#10094;");
    //     navArrow.addEventListener('click', ()=>{
    //         navSlides(slideshowIndex, (i ? 1 : -1));
    //     });
    //     newSlideshow.appendChild(navArrow);
    // }


    //Create next/prev arrows
    let nextBtn = document.createElement('a');
    nextBtn.className += (" " + wsap.classes.prevArrow);
    nextBtn.innerHTML = "&#10094;";
    nextBtn.addEventListener('click', ()=>{
        navSlides(slideshowIndex, -1);
    });
    let prevBtn = document.createElement('a');
    prevBtn.className += (" " + wsap.classes.nextArrow);
    prevBtn.innerHTML = "&#10095;";
    prevBtn.addEventListener('click', ()=>{
        navSlides(slideshowIndex, 1);
    });
    newSlideshow.appendChild(nextBtn);
    newSlideshow.appendChild(prevBtn);
}

function getOverlay(){
    let lightboxOverlay = document.getElementById('ezee-overlay');
    
    // If no overlay yet, create it
    if(!lightboxOverlay){
        lightboxOverlay = document.createElement('div');
        lightboxOverlay.id = 'ezee-overlay';
        lightboxOverlay.className += (" " + wsap.classes.lightboxOverlay);
        lightboxOverlay.style.display = "none";
            
        // Close btn in upper left
        const closeBtn = document.createElement('a');
        closeBtn.className += (" " +  wsap.classes.closeLighboxBtn);
        closeBtn.innerHTML = '<span class="'+ wsap.classes.xBtnBar + '"></span><span class="'+ wsap.classes.xBtnBar + '">';
        closeBtn.addEventListener('click', closeLightbox);
        lightboxOverlay.appendChild(closeBtn);
        
        // Append new overlay to document
        const body = document.getElementsByTagName('body')[0];
        body.appendChild(lightboxOverlay); 
    }

    // Return the overlay element
    return lightboxOverlay;
}

// Used by nav arrows
function navSlides(sliderIndex, direction){
    //Takes either +1 or -1 int for 'direction'
    const slideshow = initializedSlideshows[sliderIndex-1];
    showSlide(sliderIndex, slideshow.current + direction)
}

function showSlide(sliderIndex, imgIndex){
    //First sets all images to be invisible
    const slideshow = initializedSlideshows[(sliderIndex-1)];
    for(let s = 0; s < slideshow.allImgs.length; s++){
        let img = slideshow.allImgs[s];
        img.style.display = 'none';
    }

    //Checks number passed in, setting final index accordingly 
    let showImg;
    if(imgIndex < 1){showImg = (slideshow.allImgs.length - 1);}
    else if(imgIndex > slideshow.allImgs.length){showImg = 0; }
    else { showImg = (imgIndex -1) }
    
    //Get html reference from list and sets style to be visible
    slideshow.allImgs[showImg].style.display = "flex";


    const dots = slideshow.navDots;
    //Removes 'active-dot' class from all dots
    if(dots.length > 0){
        for(let q=0; q<dots.length; q++){
            dots[q].className = dots[q].className.replace(" active-dot", "");
        }
        //Sets ' active-dot' on the index relative to img
        dots[showImg].className += " active-dot";
    }

    slideshow.current = showImg +1;
}

function showLightbox(sliderIndex, imgIndex){
    let overlay = document.getElementById('ezee-overlay');
    //Hide all slideshows in lightbox
    let lightboxSlideshows = [...overlay.getElementsByClassName('ezee-lightbox-slideshow')];
    for(let q = 0; q<lightboxSlideshows.length; q++){
        lightboxSlideshows[q].style.display = "none";
    }
    initializedSlideshows[sliderIndex -1].el.style.display = "block";
    if(overlay && overlay.style.display != "block"){ overlay.style.display = 'block'; }
    showSlide(sliderIndex, imgIndex);
}

function closeLightbox(e){
    e.preventDefault();
    let overlay = document.getElementById('ezee-overlay');
    overlay.style.display = 'none';
}

// Generates thumbnail url, if prefix, suffix, or extension is present
function buildThumbUrl(imgEl, thumbOptions){
    const prefix = (thumbOptions.prefix || '');
    const suffix = (thumbOptions.suffix || '');
    const imgUrl = ( (imgEl.dataset.src || imgEl.getAttribute('src') || '').split('/') );
    
    const filePath = imgUrl.pop().split('.');
    const basePath = imgUrl.join('/');
    
    const ext = filePath.pop();
    const fileName = filePath.join('.');
    const thumbName = (prefix + fileName + suffix);
    
    // Uses passed in extension or same extension as main file
    return (basePath + '/' + thumbName + '.' + (thumbOptions.ext || ext) );
}


//Automates building galleries and slideshows.
window.addEventListener('DOMContentLoaded', wsap.initStuff);

// Encoded loading gif
const loadingGif = 'data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==';