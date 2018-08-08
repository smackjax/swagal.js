// initializes all slideshows and galleries with default options
wsap.autoInit();

const galleryOptions = {
    'thumbs': {
        prefix: 't-',
        suffix: '-t',
        ext: 'jpg'
    },

    classes: {

    }
};

const sliderOptions = {
    classes: {
        
    }
}

wsap.createGallery('gallery-id', galleryOptions);
wsap.createGallery(galleryElem);

wsap.createSlideshow('gallery-id', sliderOptions);