const addIndex = (items) => {
  return items.map((item, index) => {
    item.index = index
    return item
  })
}

const addIndexHead = (items) => {
  return items.map((item, index) => {
    return {title: item, index}
  })
}

const processBodyData = (items) => {
  return items.map(item => {
    return {
      nombre: item[0],
      telefono: item[1],
      email: item[2],
      compania: item[3],
      comptel: item [4],
      direccion: item[5],
      ciudad: item[6],
      index: item.index
    }
  })
}
