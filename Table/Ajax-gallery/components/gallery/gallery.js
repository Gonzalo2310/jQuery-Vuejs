const head2 = document.getElementsByTagName('head')[0]
const style2 = document.createElement('link')
style2.href = 'components/gallery/gallery.css'
style2.type = 'text/css'
style2.rel = 'stylesheet'
head2.append(style2)

Vue.component('gallery', {
  props: {
    url: {
      type: String,
      default: '',
      validator: url => {
        if (!url) {
          console.error('La url es necesario para recoger las imágenes')
          return false
        }
        return true
      }
    },
    reload: {
      type: String,
      default: '',
      validator: url => {
        if (!url) {
          console.error('reload es necesario para realizar el load more')
          return false
        }
        return true
      }
    },
    first: {
      type: Number,
      default: 6
    },
    step: {
      type: Number,
      default: 2
    },
    page: {
      type: Number,
      default: 1,
      required: false
    },
    loading: true,
    fields: {
      type: Object,
      default: () => {
        return {
          page: 'page',
          limit: 'limit',
          image: 'download_url',
          full: 'download_url',
          text: 'author'
        }
      }
    }
  },
  data () {
    return {
      elementos: [],
      localPage: 1
    }
  },
  mounted() {
    this.localPage = this.page
    this.updateElementos(this.url, this.first)
    if (this.first !== this.step) {
      this.localPage = Math.floor(this.first / this.step) + 1
    } else {
      ++this.localPage
    }
  },
  methods: {
    process_url_image(item, field) {
      if (field.includes('{')) {
        let inicio = field.indexOf('{')
        let final = field.indexOf('}')
        let fieldFind = field.substring(inicio + 1, final)
        return field.substring(0, inicio) + item[fieldFind] + field.substring(final + 1)
      }
      return item[field]
    },
    updateElementos(urlAjax, steps, reload = false) {
      let localUrl = urlAjax.replace(`{${this.fields.page}}`, this.localPage).replace(`{${this.fields.limit}}`, steps)
      const me = this
      fetch(localUrl)
        .then(response => response.json())
        .then(data => {
          if (reload) {
            me.elementos = me.elementos.concat(data)
            me.localPage ++
          } else {
            me.elementos = data
          }
        })
    },
    moreLoad() {
      this.updateElementos(this.reload, this.step, true)
    }
  },
  template: `<div class="layout">
            <div class="list">
              <div class="container-list">
                 <div>&nbsp;</div>
                 <div class="elementos" id="elementos">
                   <div class="elemento" v-for="item in elementos" :key="item.id" @click="$emit('open', item[fields.full])">
                <figure style="float: right">
                  <img :src="process_url_image(item, fields.image)" :alt="item[fields.text]" :data-full="item[fields.full]" class="imagefull">
                <figcaption>{{item[fields.text]}}</figcaption>
                </figure>
             </div>
                </div>
               <div>&nbsp;</div>
               <div><button class="btn btn-success" id="buttonUpload" type="button" @click="moreLoad" :disabled="page > 490">Cargar mas...</button></div>
               <div>&nbsp;</div>
            </div>
          </div>
        </div>`
})

