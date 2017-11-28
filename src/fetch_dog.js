import { state } from './state'

// Dog layout
const d = dog => `
    <div class="dog">
        <h1>Doggie #${ dog.id }</h1>
        <img src="${ dog.url }" title="${ dog.id }" />
    </div>
`

// dog html xfs
const prependDogHtmlXf = id => el => el.innerHTML = `${ d(state.dogs.all[id]) + el.innerHTML }`
const appendDogHtmlXf = id => el => el.innerHTML = `${ el.innerHTML + d(state.dogs.all[id]) }`

// add the dog to state
const makeAddDog = addXf => dogUrl => {
  if (dogUrl !== 'Breed not found'){
    const newId = state.dogs.all.length
    const newDog = { id: newId, url: dogUrl, xf: addXf(newId) }
    state.dogs.all.push( newDog )
    state.dogs.size += 1
  }
}

// ready-for-use partials
const prependDog = makeAddDog(prependDogHtmlXf)
const appendDog = makeAddDog(appendDogHtmlXf)

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
const fetchDog = xfCallback => breed => fetchDogForUrl(xfCallback, breed)

export { fetchDog,
          /* body xfs ->*/ prependDog, appendDog}
