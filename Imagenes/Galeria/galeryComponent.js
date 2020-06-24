const head = document.getElementsByTagName('head')[0]
const style = document.createElement('link')
style.href = 'estilo.css'
style.type = 'text/css'
style.rel = 'stylesheet'
head.append(style)

Vue.component('gallery', {
  props: {
    listContent: {
      type: Array,
      require: true,
    }
  },
  data() {
    return {
      posicion: 0,
      direccion: 0,
      imagenes_actuales1:'',
      imagenes_actuales2:'',
      imagenes_actuales3:'',
      retro: false,
      move: false,
      button_left_desactived: true,
      button_right_desactived: false
    }
  },
  created(){
    this.imagenes_actuales1 = this.listContent[0]
    this.imagenes_actuales2 = this.listContent[0]
    this.imagenes_actuales3 = this.listContent[1]
  },
  methods: {
    mover_left() {
      this.direccion = 1
      this.retro = true
      const me = this
    },
    mover_der() {
      this.direccion = 2
      this.move=true
      const me = this
    },
    animationEnd() {
      const me = this
      if (this.direccion === 1) {
        this.imagenes_actuales2 = this.imagenes_actuales1
        setTimeout(()=> {
          me.retro = false
          me.imagenes_actuales3= me.listContent[me.posicion + 1]
          me.imagenes_actuales1= me.listContent[me.posicion -1 ]
        }, 500)
        --this.posicion
      }
      if (this.direccion === 2) {
        this.imagenes_actuales2 = this.imagenes_actuales3
        setTimeout(()=> {
          me.move = false
          me.imagenes_actuales3= me.listContent[me.posicion + 1]
          me.imagenes_actuales1= me.listContent[me.posicion -1 ]
        }, 500)
        ++this.posicion
      }
      this.button_left_desactived = this.posicion <= 0;
      this.button_right_desactived = this.posicion >= (this.listContent.length - 1);
      this.direccion = 0
    }
  },
  template: `
        <div>
      <div class="row">
        <div class="col-12 grilla">
          <div>
            &nbsp;
          </div>
          <div class="content-image">
            <div class="image" id="image1" :class="{retromove: retro }">
              <img :src="imagenes_actuales1" alt="..." class="image" id="imagen_screen1" >
            </div>
            <div @animationend="animationEnd" class="image" id="image2" :class="{retromove: retro , move: move }">
              <img :src="imagenes_actuales2" alt="..." class="image" id="imagen_screen2" >
            </div>
            <div class="image" id="image3" :class="{move: move}">
              <img :src="imagenes_actuales3" alt="..." class="image" id="imagen_screen3" >
            </div>
          </div>
          <div>
            &nbsp;
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12 grilla">
          <div>
            &nbsp;
          </div>
          <div class="grilla sombra">
            <button class="btn btn-primary" @click="mover_left" :disabled="button_left_desactived"><<</button>
            <div>&nbsp;</div>
            <button class="btn btn-primary" @click="mover_der" :disabled="button_right_desactived">>></button>
          </div>
          <div>
            &nbsp;
          </div>
        </div>
      </div>
      </div>`
})
