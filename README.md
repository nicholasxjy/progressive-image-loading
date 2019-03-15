## NProgressiveImage

NProgressiveImage is a progressive image loading plugin like medium effect

## Features

- Small
- Simple
- No other dependencies

## Installation

```bash
$ npm i nico-progressive-image
```

### How to use it

```html
<script src="../dist/nico-progressive-image.min.js"></script>
<script>
  window.onload = function() {
    new NProgressiveImage({
      container: '.content',
      items: '.nprogressive-image',
      widthAttr: 'data-width',
      heightAttr: 'data-height'
    })
  }
</script>
```

```javascript

import NProgressiveImage from 'nico-progressive-image'

new NProgressiveImage({
  container: '.content',
  items: '.nprogressive-image',
  widthAttr: 'data-width',
  heightAttr: 'data-height'
})

```

Great thanks to [http://www.quasimondo.com/StackBlurForCanvas/StackBlurDemo.html](http://www.quasimondo.com/StackBlurForCanvas/StackBlurDemo.html)
