#### swagal.js

# Async gallery with generated lightbox
## (and slideshows, I guess)

### What it is
A script that automatically generates a responsive gallery connected to a lightbox.
It also automatically makes slideshows, but they're more of a starting point.

### How to use it
**Important:** both initialization options have to be put inside a `'DOMContentLoaded'` event listener.
I figured it was easier to require that potential annoyance and have more granular control.


#### Initializing
**Options for initializing**
1. Automatically initialize all slideshows and galleries on the page
    + Uses default options
    - Can't selectively override defaults & classes
    - No way to selectively initialize some while automatically initializing the rest
    - In reality only most helpful if multiple galleries/slideshows on the same page

2. Individually initialize
    + Uses default options
    + Can selectively override options & classes
    - Have to initialize each element by passing it into correct 'init' function

**Notes:**
* If a new `'classes'` object is passed it will only override the keys inside, not completely overwrite
* If an object is passed to `'options'` it will *not* update the base, it will completely overwrite it

##### Automatic(all on page)
```javascript
window.addEventListener('DOMContentLoaded', swgl.autoInit);
```

##### Individually
###### Minimal
```javascript
window.addEventListener('DOMContentLoaded', ()=>{ 
    swgl.initGallery('gallery-1');
    swgl.initSlideshow('slide-1');
    swgl.initGallery('gallery-2');
    swgl.initSlideshow('slide-2');
});

```

###### Override defaults
```javascript
// --- Initialize individually
window.addEventListener('DOMContentLoaded', ()=>{ 
    swgl.initGallery('gallery-1',
        // Options
        {
            thumbs: {
                prefix: 't-',
                // suffix: '',
                // ext: 'jpg'
            },
        },
        // Does not replace entire default class object, only overwrites classes present here
        {
            'galleryWrapper' : 'new-class-name',
            // Can have multiple classes with space between
            'xBtnBar' : 'swgl-btn-bar purple-btn-bar'
        }
    );
});
```


#### Thumbnails
* Global thumbnail settings are under `'thumbs'` key in `'swgl.options'`
* Thumbnails are loaded before their larger counterparts
* Thumbnail settings only apply to gallery images
* Each setting key can be used without the others
* No thumbnail settings are required

##### Examples
```javascript
// Start URL 
const src = 'https://place.com/an-image.jpg';
swgl.options.thumbs = {
    // Image prefix
    'prefix' : 't-',
    // Image suffix
    'suffix' : '_small',
    // Image extension
    'ext' : 'png'
}

// Final thumbnail URL
// https://place.com/t-an-image_small.png
```

#### Nav dots
```javascript
// Turn on building nav dots
swgl.options.navdots = true;
```
