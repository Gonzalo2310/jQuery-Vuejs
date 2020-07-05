(function ($) {
  $.fn.imageModal = function (options) {
    let settings = $.extend({
      url: '',
      open: true
    }, options)
    if (!settings.url && settings.open) {
      console.error('Url es necesario para mostrar la imagen')
      return
    }
    if (jQuery('#linkeado').length === 0) {
      jQuery('head').append('<link id="linkeado" rel="stylesheet" href="./plugins/modal/modal.css">')
    }

    if (settings.open) {
      return this.append(`<div class="modal showModal" tabindex="-1" role="dialog" id="modalImagen" >
                                   <div>&nbsp;</div>
                                    <div class="modal-dialog">
                                       <div class="modal-content">
                                          <div class="modal-header">
                                             <h5 class="modal-title">Datos de la imagen</h5>
                                             <button type="button" class="close" data-dismiss="modal" aria-label="Close" id="buttonClose">
                                                <span aria-hidden="true">&times;</span>
                                             </button>
                                          </div>
                                          <div class="modal-body">
                                             <img src="${settings.url}" id="imageModalCenter">
                                          </div>
                                          <div class="modal-footer">
                                             <button type="button" class="btn btn-secondary" data-dismiss="modal" id="modalClose">Cerrar</button>
                                          </div>
                                       </div>
                                    </div>
                                    <div>&nbsp;</div>
                                </div>`)
    }
    jQuery('#modalImagen').removeClass('showModal').addClass('hideModal')
    setTimeout(function () {
      jQuery('#modalImagen').remove()
      jQuery('#linkeado').remove()
    }, 350)
  }
}(jQuery))
