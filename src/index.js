import debounce from 'lodash.debounce'
import blurImage from './stackblur'
import './style.css'

const defaultOption = {
  container: '',
  items: '',
  offsetTop: 10,
  blurRadius: 10,
  widthAttr: 'data-width',
  heightAttr: 'data-height'
}

function isInViewport(el) {
  const rect = el.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

class NProgressiveImage {
  constructor(option) {
    if (!option.container) {
      throw new Error('container need to be set!')
    }
    if (typeof option.container === 'string') {
      this.container = document.querySelector(option.container)
    } else {
      this.container = option.container
    }
    if (option.items && Array.isArray(option.items)) {
      this.items = option.items
    } else if (option.items && typeof option.items === 'string') {
      this.items = this.container.querySelectorAll(option.items)
    } else {
      this.items = this.container.querySelectorAll('img')
    }
    this.option = Object.assign({}, defaultOption, option)
    this.handleScroll = this.handleScroll.bind(this)
    this.handleResize = this.handleResize.bind(this)
    this.init()
    this.attachEvents()
    // for first check
    this.loadItems()
  }
  init() {
    //
    const items = []
    const rect = this.container.getBoundingClientRect()
    const len = this.items.length
    for (let i = 0; i < len; i++) {
      let item = this.items[i]
      const wrapperObj = this.createItemTemplate(item)
      const { w, h } = this.setDimension(wrapperObj, item, rect.width)
      //blur image
      blurImage(
        item,
        wrapperObj.canvas,
        parseInt(w / 10),
        parseInt(h / 10),
        this.option.blurRadius
      )
      items.push({
        el: wrapperObj.div,
        src: item.getAttribute('data-src'),
        isLoaded: false,
        isError: false
      })
    }
    this.items = items
  }
  createItemTemplate(item) {
    const div = document.createElement('div')
    div.classList.add('nprogressive-image-item')
    const canvas = document.createElement('canvas')
    item.parentNode.replaceChild(div, item)
    div.appendChild(item)
    div.appendChild(canvas)
    return { div, canvas }
  }
  setDimension(wrapperObj, item, width) {
    let originalWidth = parseInt(item.getAttribute('data-width'), 10) || 0
    let originalHeight = parseInt(item.getAttribute('data-height'), 10) || 0
    let w = originalWidth
    let h = originalHeight
    if (originalWidth >= width) {
      w = width
      h = parseInt((originalHeight * w) / originalWidth)
    }
    wrapperObj.div.style.width = w + 'px'
    wrapperObj.div.style.height = h + 'px'
    wrapperObj.canvas.width = parseInt(w / 10)
    wrapperObj.canvas.height = parseInt(h / 10)
    return { w, h }
  }
  attachEvents() {
    window.addEventListener('scroll', this.handleScroll, false)
    window.addEventListener('resize', this.handleResize, false)
  }
  handleScroll() {
    this.loadItems()
  }
  handleResize() {
    this.loadItems()
  }
  loadItems() {
    const { items } = this
    for (let i = 0, len = items.length; i < len; i++) {
      if (!items[i].isLoaded && !items[i].isError) {
        if (isInViewport(items[i].el)) {
          // here load origin image
          this.loadImage(items[i])
        }
      }
    }
  }
  loadImage(item) {
    item.el.classList.add('is--loading')
    const img = new Image()
    img.onload = () => {
      img.classList.add('nprogressive-source-image')
      item.isLoaded = true
      item.el.appendChild(img)
      item.el.classList.add('is--loaded')
    }
    img.onerror = () => {
      item.isError = true
    }
    img.src = item.src
  }
  destroy() {
    window.addEventListener('scroll', debounce(this.handleScroll, 250), false)
    window.addEventListener('resize', debounce(this.handleResize, 250), false)
  }
}

export default NProgressiveImage
