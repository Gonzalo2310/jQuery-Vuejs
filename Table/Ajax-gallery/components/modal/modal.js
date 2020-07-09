const head = document.getElementsByTagName('head')[0]
const style = document.createElement('link')
style.href = 'components/modal/modal.css'
style.type = 'text/css'
style.rel = 'stylesheet'
head.append(style)

Vue.component('modal', {
  props: {
    url: {
      type: String,
      default: '',
      validator: url => {
        if (!url) {
          console.error('Url es necesario para mostrar la imagen')
          return false
        }
        return true
      }
      },
    open: {
      type: Boolean,
      require: false,
      default: false
    }
  },
  data () {
    return {
      status: 3
    }
  },
  created() {
    this.status = this.open ? 0 : 1
  },
  watch: {
    open: function(val) {
      this.status = val ? 0 : 1
    },
    status: function(val) {
      if (val === 1) {
        this.waitDestroy()
      }
    }
  },
  computed: {
    modalStatus() {
      return ['showModal', 'hideModal', ''][this.status]
    }
  },
  methods: {
    waitDestroy() {
      const me = this
      setTimeout(()=>{
        me.status = 2
        me.$emit('close')
      }, 450)
    }
  },
  template: `<div class="modal" :class="modalStatus" tabindex="-1" role="dialog" id="modalImagen" >
                                   <div>&nbsp;</div>
                                    <div class="modal-dialog">
                                       <div class="modal-content">
                                          <div class="modal-header">
                                             <h5 class="modal-title">Datos de la imagen</h5>
                                             <button type="button" class="close" data-dismiss="modal" aria-label="Close" id="buttonClose" @click="status = 1">
                                                <span aria-hidden="true">&times;</span>
                                             </button>
                                          </div>
                                          <div class="modal-body">
                                             <img :src="url" id="imageModalCenter">
                                          </div>
                                          <div class="modal-footer">
                                             <button type="button" class="btn btn-secondary" data-dismiss="modal" id="modalClose" @click="status = 1">Cerrar</button>
                                          </div>
                                       </div>
                                    </div>
                                    <div>&nbsp;</div>
                                </div>`
})

