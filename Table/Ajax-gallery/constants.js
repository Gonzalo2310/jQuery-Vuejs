const piscum = {
  url: 'https://picsum.photos/',
  list: 'v2/list',
  listPaginate: (page = 1, limit = 10) => `v2/list?page=${page}&limit=${limit}`,
  height: height => height ? `/${height}` : '',
  details: id => `id/${id}/info`,
  idPhoto: id => `id/${id}/`,
  random: (width=200, height=null) => `${this.url}${width}${this.height(height)}`,
  effect: (url, blur = null, grayscale = null) => {
    let simbolo = false
    if (blur) {
      if (parseInt(blur) < 0) {
        blur = 1
      }
      if (parseInt(blur) > 10) {
        blur = 10
      }
      if (typeof blur ==='string') {
        blur = parseInt(blur)
      }
      url += `?blur=${blur}`
      simbolo = true
    }
    if (grayscale) {
      if (simbolo) {
        url+='&'
      } else {
        url +='?'
      }
      url +='grayscale'
    }
    return url
  }
}
