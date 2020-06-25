const tableReplace = [
  {
    text: 'Nombre',
    replace: 'nombre'
  },
  {
    text: 'Telefono',
    replace: 'telefono'
  },
  {
    text: 'Email',
    replace: 'email'
  },
  {
    text: 'Compañía',
    replace: 'compania'
  },
  {
    text: 'Comp. Tel.',
    replace: 'comptel'
  },
  {
    text: 'Dirección',
    replace: 'direccion'
  },
  {
    text: 'Ciudad',
    replace: 'ciudad'
  }
]

const purifyHeader = (items) => {
  return items.map(item => replaceAll(item))
}

const replaceAll = (str) => {
  const item = tableReplace.find(item => item.text === str)
  if (item) {
    return item.replace
  }
  return str.toLowerCase()
}



/*************** Head ***************/
const templateHead = (items) => {
  let result = []
  items.every(item => result.push(templateItemHead(item)))
  return `<thead><tr>${result.join('')}</tr></thead>`
}

const templateItemHead = ({title}) => `<th scope="col">${title}</th>`


const templateItemsBody = (items, header) => {
  let result = []
  let order = purifyHeader(header.map(item => item.title))
  items.forEach(item => {
    result.push(templateItemBody(item, order))
  })
  return `<tbody>${result.join('')}</tbody>`
}

/***************** columnas **********************/
const templateItemBody = (item, order) => {
  let response = []
  order.forEach(element => {
    response.push(templateSimpleItem(item[element]))
  })
  return `<tr>${response.join('')}</tr>`
}


const templateSimpleItem = (item) => `<td>${item}</td>`



