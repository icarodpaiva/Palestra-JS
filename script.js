let page = 1
let charactersList = []
const containerCharacters = document.querySelector("#container-characters")
const prevPagination = document.querySelector("#prev-pagination")
const modal = document.querySelector("#modal")

const requestCharacters = async changePage => {
  containerCharacters.innerHTML = '<div class="loading">Loading...</div>'

  if (changePage === "next") {
    page++
  }

  if (changePage === "prev") {
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
        status        
        origin {
          name
          dimension
        }              
      }
    }
  }`
  const variables = { page }

  const response = await fetch("https://rickandmortyapi.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query,
      variables
    })
  })
  const {
    data: {
      characters: { results }
    }
  } = await response.json()

  charactersList = [...results]
  showCharacters()
}

const showCharacters = () => {
  charactersToRender = charactersList.map(
    character =>
      `<div class="container-character" role="button" onclick="showModal('${character.id}')">
        <p><img src=${character.image} /></p>
        <p>Name: <strong>${character.name}</strong></p>
        <p>Species: ${character.species}</p>
      </div>`
  )

  containerCharacters.innerHTML = charactersToRender.join("")
}

const showModal = id => {
  const characterClicked = charactersList.find(character => character.id === id)

  const modalInfos = `<button onclick="closeModal()">X</button>
        <div class="container-character">
          <p><img src=${characterClicked.image} /></p>
          <p>Name: <strong>${characterClicked.name}</strong></p>
          <p>Species: ${characterClicked.species}</p>
          <p>Status: ${characterClicked.status}</p>     
          <p>Origin name: ${characterClicked.origin.name}</p>
          <p>Origin dimension: ${characterClicked.origin.dimension}</p>
        </div>`

  modal.innerHTML = modalInfos
  modal.style.display = "flex"
}

const closeModal = () => {
  modal.innerHTML = ""
  modal.style.display = "none"
}

requestCharacters()
