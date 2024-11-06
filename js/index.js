

const addUser = user => {
    const userList = document.querySelector("#user-list");

    const newUser = document.createElement("li");
    newUser.className = user.id;
    newUser.textContent = user.login;

    newUser.addEventListener("click", () => {
        renderRepos(user.login);
    })

    userList.append(newUser);
}

const searchUser = () => {
    const searchForm = document.querySelector("#github-form")
    
    searchForm.addEventListener("submit", (e)=> {
        e.preventDefault();

        const searchTerm = searchForm.search.value;
        renderUsers(searchTerm);
    })
}

const renderUsers = (searchTerm='octocat') => {
    document.querySelector("#user-list").innerHTML = ""

    const gitURL = "https://api.github.com/search/";

    fetch(`${gitURL}users?q=${searchTerm}`)
    .then(res => {
        if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
    })
    .then(data => data.items.forEach(addUser))
    }

function renderRepo(repo) {
    const repoList = document.querySelector("#repos-list");

    const newRepo = document.createElement("li");
    newRepo.textContent = repo.name;

    repoList.append(newRepo)
}

function renderRepos(userName) {
    document.querySelector("#repos-list").innerHTML = ""

    const repoURL = "https://api.github.com/users";

    fetch(`${repoURL}/${userName}/repos`)
    .then(res => {
        if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
    })
        .then(data => {

            const repoData = data.reduce((accumulator, repoDict) => {
                const repoInfo = {owner: repoDict.owner.login,
                                    name: repoDict.name}
                
                const newEntry =  { [repoDict.id]: repoInfo };
                return { ...accumulator, ...newEntry };
            }, {})

            const repoArr = Object.values(repoData);
            
            repoArr.forEach(renderRepo);
        })
    }

document.addEventListener("DOMContentLoaded", ()=>{
    renderUsers();
    searchUser();
})
