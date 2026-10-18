

const debounce = (fn, debounceTime = 0) => {
    let timer
            
    return function() {
    clearTimeout(timer)
                
    timer = setTimeout(() => {
     fn.apply(this, arguments)
    }, debounceTime)
 }
}
const input = document.querySelector('input')
const hints = document.querySelector('.hints')
const added_rep = document.querySelector('.added_repositories')
const history = document.querySelector('.history')

const saved = localStorage.getItem('searchHistory')
const searches = saved ? JSON.parse(saved) : []

for (let r of searches) {
  const searchDiv = document.createElement('div')
  searchDiv.textContent = r
  history.append(searchDiv)
}

input.addEventListener('input', debounce((event) => {
    const value = event.target.value
    if (value == '') {
        hints.innerHTML = ''
        return 
    }
    console.log(value)

    fetch("https://api.github.com/search/repositories?q=" + value)
    .then(response => response.json())
    .then(data => {

        hints.innerHTML = ''

        for (let r in data.items) {
        if (r >= 5) {
            break
        }

        const newDiv = document.createElement('div')
        newDiv.textContent = data.items[r].name
        hints.append(newDiv)

        newDiv.addEventListener('click', () => {
          const div = document.createElement('div')
          div.classList.add('repositories_card')
          added_rep.append(div)

          const nameDiv = document.createElement('div')
          nameDiv.classList.add('name')
          nameDiv.textContent = 'Name: ' + data.items[r].name
          div.append(nameDiv)

          const ownerDiv = document.createElement('div')
          ownerDiv.classList.add('owner')
          ownerDiv.textContent = 'Owner: ' + data.items[r].owner.login
          div.append(ownerDiv)

          const starsDiv = document.createElement('div')
          starsDiv.classList.add('stars')
          starsDiv.textContent = 'Stars: ' + data.items[r].stargazers_count
          div.append(starsDiv)

          const x = document.createElement('div')
          x.classList.add('clear')
          x.textContent = 'X'
          div.append(x)
          x.addEventListener('click', () => {
            div.remove()
          })

          const rep = localStorage.getItem('searchHistory')
          const repo = rep ? JSON.parse(rep) : []
          repo.push(value)
          localStorage.setItem('searchHistory', JSON.stringify(repo))

          const repDiv = document.createElement('div')
          repDiv.textContent = value
          history.append(repDiv)

          input.value = ''
          hints.innerHTML = ''
        })

    } 
  })
}, 500)
)
