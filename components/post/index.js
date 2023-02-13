class MastoPost extends HTMLElement {
    connectedCallback(){
        console.log("post render");
        console.log(this.post);
        
        const template_name = this.getAttribute('template');
        console.log({template_name});
        const template = template_name ? document.getElementById(template_name).content : this.createTemplate() 
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(template.cloneNode(true));
       
        this.renderPost();
    }

    createTemplate() {
        const template = document.createDocumentFragment();
        const content = document.createElement('div');
        content.innerHTML = `
            <article>
                <h2 id="name"></h2>
                <h3 id="username"></h3>
                <p id="body"></p>
                <p>
                    Replies <span id="replies"></span>
                    Favourites <span id="favs"></span>
                </p>
            </article>
        `
        template.appendChild(content);
        return template;
    }

    getElement(id) {
        return this.shadowRoot.getElementById(id)
    }

    renderPost() {
        const {
            account,
            content,
            favourites_count,
            replies_count
        } = this.post;
        const { acct, display_name } = account;
        this.getElement('name').textContent = display_name;
        this.getElement('username').textContent = acct;
        this.getElement('body').innerHTML = content;
        this.getElement('replies').textContent = replies_count;
        this.getElement('favs').textContent = favourites_count;
    }

    static get observerdAttributes() {
        return ["post"];
    }

    attibuteChangedCallback(attrName, oldValue, newValue) {
        if (oldValue != newValue){
            console.log("new data received")
            this.renderPost();
        }
    }

    get post() {
        return this._post;
    }

    set post(postData) {
        this._post = postData;
    }
}

customElements.define("masto-post", MastoPost);

