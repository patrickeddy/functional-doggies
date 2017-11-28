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
    const newDog = { id: newId, url: dogUrl, clickHandler: dogClickHandler, xf: addXf(newId) }
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

// fetchDog(p:partial, breed:string)(el: Element object)
const fetchDog = xfCallback => breed => fetchDogForUrl(xfCallback, breed)

// Clears the dogs from the element
const clearDogs = (el) => {
  el.innerHTML = ""
  state.dogs.all.length = 0
  state.dogs.size = 0
  state.dogs.oldSize = 0
}

// Dog clicked
const dogClickHandler = (e) => {
  if (e.target.classList.contains('spin')) {
    e.target.classList.remove('spin') // remove spin if clicked
  }
}

// Ready-to-use partials
const prependDog = makeAddDog(prependDogHtmlXf)
const appendDog = makeAddDog(appendDogHtmlXf)
const spinDog = makeAddDog(spinDogHtmlXf)

export {
  fetchDog,
  clearDogs,
  dogClickHandler,
  /* element xfs ->*/
  prependDog, appendDog, spinDog
}
