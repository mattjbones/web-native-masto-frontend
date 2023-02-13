class MastoPosts extends HTMLElement {
    connectedCallback() {
        console.log('ready');
        //render
        const template_name = this.getAttribute('template');
        const template = template_name ? document.getElementById(template_name).content : this.createTemplate() 
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(template.cloneNode(true));

        //make api call
        this.loadPosts();
    }

    createTemplate() {
        const template = document.createDocumentFragment();
        const content = document.createElement('div');
        content.innerHTML = `
            <div id="posts">
                <span>Loading...</span>
            </div>
        `
        template.appendChild(content);
        return template;
    }

    createPost(postData) {
        const postElement = document.createElement('masto-post');
        postElement.post = postData;
        postElement.setAttribute("template", this.getAttribute("post-template"));
        this.shadowRoot.getElementById("posts").appendChild(postElement);
    }

    async loadPosts(){
        const posts = await fetch("https://mastodon.social/api/v1/timelines/public");
        const body = await posts.json();
        if (posts.ok) {
            console.log("posts loaded");
            this.shadowRoot.getElementById("posts").innerHTML = "";
            console.log(body);
            body.forEach(post => this.createPost(post));
        }
    }
}

customElements.define("masto-posts", MastoPosts);