(function ($) {
  $.fn.gallery = function (options) {
    let settings = $.extend({
      url: '',
      reload: '',
      first: 6,
      step: 2,
      page: 0,
      loading: true,
      fields: {
        page: 'page',
        limit: 'limit',
        image: 'download_url',
        full: 'download_url',
        text: 'author'
      }
    }, options)
    if (!settings.url) {
      console.error('Url es necesario para recoger las imagenes')
      return
    }
    if (settings.page < 1) {
      settings.page = 1
    }
    if (!settings.url.includes(`{${settings.fields.page}`) || !settings.url.includes(`{${settings.fields.limit}`)) {
      console.error(`Son necesarios los parametros ${settings.fields.page} y ${settings.fields.limit} para paginar el resultado. 
      Ejemplo: https://picsum.photos/v2/list?page={${settings.fields.page}}&limit={${settings.fields.limit}}`)
      return
    }
    if (settings.loading) {
      jQuery('head').append('<link rel="stylesheet" href="./plugins/gallery/gallery.css">')
      settings.loading = false
    }

    let elementos = []
    const me = this
    function process_url_image(item, field) {
      if (field.includes('{')) {
        let inicio = field.indexOf('{')
        let final = field.indexOf('}')
        let fieldFind = field.substring(inicio + 1, final)
        return field.substring(0, inicio) + item[fieldFind] + field.substring(final + 1)
      } else {
        return item[field]
      }
    }

    function updateElementos(urlAjax, steps, reload = false) {
      let localUrl = urlAjax.replace(`{${settings.fields.page}}`, settings.page).replace(`{${settings.fields.limit}}`, steps)
      jQuery.ajax({
        async: false,
        type: 'GET',
        url: localUrl,
        success: function (data) {
          data.forEach(item => {
            elementos.push(`<div class="elemento">
                <figure style="float: right">
                  <img src="${process_url_image(item, settings.fields.image)}" alt="${item[settings.fields.text]}" data-full="${item[settings.fields.full]}" class="imagefull">
                <figcaption>${item[settings.fields.text]}</figcaption>
                </figure>
             </div>`)
          })
          settings.page ++
        }
      })
    }

    function modalClose() {
        jQuery('body').imageModal({
          open: false
        })
    }

    function modalOpen(evt) {
        jQuery('body').imageModal({
          url: jQuery(evt.target).data('full'),
          open: true
        })
      jQuery('#modalClose').on('click', modalClose)
      jQuery('#buttonClose').on('click', modalClose)
    }

    updateElementos(settings.url, settings.first)
    if (settings.first !== settings.step) {
      settings.page = Math.floor(settings.first / settings.step) + 1
    } else {
      ++settings.page
    }

    this.append(`<div class="layout">
            <div class="list">
              <div class="container-list">
                
                 <div>&nbsp;</div>
                 <div class="elementos" id="elementos">
                   ${elementos.join('')}
                </div>
               <div>&nbsp;</div>
               <div><button class="btn btn-success" id="buttonUpload" type="button" >Cargar mas...</button></div>
               <div>&nbsp;</div>
            </div>
          </div>
        </div>
`)
    jQuery('.imagefull').on('click', modalOpen)

    jQuery('#buttonUpload').on('click', function () {
      jQuery('.imagefull').off('click')
      elementos = []
      updateElementos(settings.reload, settings.step)
      jQuery('#elementos').append(elementos.join(''))
      jQuery('.imagefull').on('click', modalOpen)
      if (settings.page > 490) {
        jQuery('#buttonUpload').attr('disabled', 'true')
      }
    })
  }
}(jQuery))
