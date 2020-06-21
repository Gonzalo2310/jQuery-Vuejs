Vue.component('view-lista', {
  props: {
    listContent: {
      type: Array,
      require: true,
    }
  },
  template: `<ul class="list-group" id="listSelected">
<option v-for="item in listContent" :key="item.index" @click="$emit('update', item)">{{item.titulo}}</option>
</ul>`
})
