let page = 1
const containerCharacteres = document.querySelector('.container-characteres')
const prevPagination = document.querySelector('#prev-pagination')

const requestCharacteres = async changePage => {
  containerCharacteres.innerHTML = '<div class="loading">Carregando...</div>'

  if (changePage === 'next') {
    page++
  }

  if (changePage === 'prev') {
    page--
  }

  if (page <= 1) {
    prevPagination.disabled = true
  } else {
    prevPagination.disabled = false
  }

  const query = `query SEARCH_CHARACTERES ($page: Int) {
    characters (page: $page){
      info {
        next
        prev
      }
      results {
        id
        image
        name    
        species
      }
    }
  }`
  const variables = { page }

  const response = await fetch('https://rickandmortyapi.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query,
      variables
    })
  })
  const {
    data: {
      characters: { results: characteresList }
    }
  } = await response.json()

  showCharacteres(characteresList)
}

const showCharacteres = characteresList => {
  const characters = characteresList.map(
    character =>
      `<div class="container-character">
        <p><img src=${character.image}></p>
        <p>Nome: <strong>${character.name}</strong></p>
        <p>Espécie: ${character.species}</p>
      </div>`
  )

  containerCharacteres.innerHTML = characters.join('')
}

requestCharacteres()
