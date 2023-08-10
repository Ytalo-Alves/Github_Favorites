import { GitHubUser } from "./GitHubUser.js";


export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || [];
  }

  save(){
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries))
  }

  async add(username) {
  try {
    const userExists = this.entries.find(entry => entry.login === username);
    if(userExists) {
      throw new Error ('Usuario já cadastrado!')
    }

    const user = await GitHubUser.search(username)
    if(user.login === undefined){
      throw new Error('Usuario não encontrado')
    }

    this.entries = [user , ...this.entries]
    this.update()
    this.save()

  } catch (error) {
    alert(error.message)
    
  }
}

  delete(user) {
    this.entries = this.entries.filter((entry) => entry.login !== user.login);
    this.update();
    this.save()
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);
    this.tbody = this.root.querySelector("table tbody");

    this.update();
    this.onadd();
  }

  onadd() {
    const addButton = this.root.querySelector(".search button");
    addButton.onclick = () => {
      const { value } = this.root.querySelector(".search input");

      this.add(value);
    };
  }

  update() {
    this.removeAllTr();
    this.entries.forEach((user) => {
      const row = this.createRow("tr");
      row.querySelector(
        ".user img"
      ).src = `https://github.com/${user.login}.png`;
      row.querySelector(".user img").alt = `imagem de ${user.login}`;
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector(".user p").textContent = user.name;
      row.querySelector(".user span").textContent = user.login;
      row.querySelector(".repositories ").textContent = user.public_repos;
      row.querySelector(".followers ").textContent = user.followers;
      row.querySelector(".remove ").onclick = () => {
        const isOK = confirm("Tem certeza que deseja cancelar essa linha ?");
        if (isOK) {
          this.delete(user);
        } else {
          return;
        }
      };

      this.tbody.append(row);
    });
  }
  createRow() {
    const tr = document.createElement("tr");

    const content = `
    
    <td class="user">
      <img src="https://github.com/diego3g.png" alt="" />
      <a href="https://github.com/diego3g" target="_blank">
        <p>Diego Fernandes</p>
        <span>diego3g</span>
      </a>
    </td>
    <td class="repositories">76</td>
    <td class="followers">9589</td>
    <td><button class="remove">&times;</button></td>
  
    `;
    tr.innerHTML = content;

    return tr;
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }
}
