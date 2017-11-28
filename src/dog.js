import { el } from './utils'
import { state } from './state'
///////////////////////
// Dog management
// - Fetching dog image urls from API
// - Adding dog with given HTMLXf to state.dogs
// Use partial methods at the bottom of the file.
///////////////////////

// Dog layout
const d = dog => `
  <div class="dog" id="dog-${ dog.id }">
      <h1>Doggie #${ dog.id }</h1>
      <img src="${ dog.url }" title="Doggie #${ dog.id }. So cute." />
  </div>
`
// dog html xfs
const prependDogHtmlXf = id => el => el.innerHTML = `${ d(state.dogs.all[id]) + el.innerHTML }`
const appendDogHtmlXf = id => el => el.innerHTML = `${ el.innerHTML + d(state.dogs.all[id]) }`
const spinDogHtmlXf = id => el => {
  const spinClass = `${ d(state.dogs.all[id]).replace('<img', '<img class="spin"') }`
  return el.innerHTML = `${ spinClass + el.innerHTML }`
}

// add the dog to state
const makeAddDog = addXf => dogUrl => {
  if (dogUrl !== 'Breed not found'){
    const newId = state.dogs.all.length
    const newDog = { id: newId, url: dogUrl, clickHandler: dogClickHandler, render: addXf(newId) }
    state.dogs.all.push( newDog )
    state.dogs.size += 1
  }
}

// Fetch dog
const fetchDogAPIUrl = (breed) => {
  if (breed === null || breed === 'random')
    return fetch('https://dog.ceo/api/breeds/image/random')
  else {
    const formatted = breed.split(' ').reverse().join().replace(',', '/')
    return fetch(`https://dog.ceo/api/breed/${ formatted }/images/random`)
  }
}
const fetchDogForUrl = (xfCallback, breed) => {
  fetchDogAPIUrl(breed)
    .then(response => response.json())
    .then(dog => dog.message)
    .then(xfCallback)
}

///////////////////////
//     Exports
///////////////////////

// fetchDog(p: addXfPartial)(breed: string)
const fetchDog = addXfPartial => breed => fetchDogForUrl(addXfPartial, breed)
// AddXfPartials
// - These functions are set to the `render` property on the dog object in state.dogs
// - Use `makeStateBroadcaster` to check for updates
//     and then render the dogs into an Element using their `render` property function:
//     => state.dogs.map( dog => dog.render(el: Element object) )
const prependDog = makeAddDog(prependDogHtmlXf) // Prepends the dog normally to the el
const appendDog = makeAddDog(appendDogHtmlXf) // Appends the dog normally to the el
const spinDog = makeAddDog(spinDogHtmlXf) // Prepends the dog spinning to the el


// clearDogs(el: Element object)
const clearDogs = (el) => {
  el.innerHTML = ""
  state.dogs.all.length = 0
  state.dogs.size = 0
  state.dogs.oldSize = 0
}

// dogClickHandler(e: Event object)
const dogClickHandler = (e) => {
  if (e.target.classList.contains('spin')) {
    e.target.classList.remove('spin') // remove spin if clicked
  }
}

export {
  fetchDog,
  /* element xfs ->*/
  prependDog, appendDog, spinDog,
  clearDogs,
  dogClickHandler
}
