let researchBlogPosts = [];
let personalBlogPosts = [];
let currentSection = 'home';
let dataLoaded = false;

function loadBlogPosts() {
    return Promise.all([
        fetch('research-blog-posts.json')
            .then(response => response.json())
            .then(data => {
                researchBlogPosts = data.posts;
                displayBlogPosts('researchBlog', researchBlogPosts);
                displayLatestPost('latestResearchPost', researchBlogPosts);
            }),
        fetch('personal-blog-posts.json')
            .then(response => response.json())
            .then(data => {
                personalBlogPosts = data.posts;
                displayBlogPosts('personalBlog', personalBlogPosts);
                displayLatestPost('latestPersonalPost', personalBlogPosts);
            })
    ]).then(() => {
        dataLoaded = true;
        routeURL();
    }).catch(error => console.error('Error loading blog posts:', error));
}

function displayBlogPosts(blogType, posts) {
    const blogContent = document.getElementById(blogType);
    blogContent.innerHTML = posts.map(post =>
        `<article class="post">
            <div class="post-content">
                <h2><a href="#/${blogType}/${post.id}" onclick="event.preventDefault(); showBlogPost('${post.id}', '${blogType}')">${post.title}</a></h2>
                <div class="post-meta">Posted on ${post.date} by ${post.author}</div>
                <p>${post.summary}</p>
            </div>
            ${post.imageUrl ? `<div class="post-image"><img src="${post.imageUrl}" alt="${post.title}"></div>` : ''}
        </article>`
    ).join('');
}

function displayLatestPost(elementId, posts) {
    const latestPost = posts.length > 0 ? posts[0] : null;
    const latestPostElement = document.getElementById(elementId);
    if (latestPost) {
        latestPostElement.innerHTML =
            `<article class="post">
                <div class="post-content">
                    <h2><a href="#/${elementId.includes('Research') ? 'researchBlog' : 'personalBlog'}/${latestPost.id}" onclick="event.preventDefault(); showBlogPost('${latestPost.id}', '${elementId.includes('Research') ? 'researchBlog' : 'personalBlog'}')">${latestPost.title}</a></h2>
                    <div class="post-meta">Latest <strong>${latestPost.type}</strong> Blog Post. Posted on ${latestPost.date} by ${latestPost.author}</div>
                    <p>${latestPost.summary}</p>
                </div>
                ${latestPost.imageUrl ? `<div class="post-image"><img src="${latestPost.imageUrl}" alt="${latestPost.title}"></div>` : ''}
            </article>`;
    }
}

function showBlogPost(postId, blogType) {
    const blogPost = document.getElementById('blogPost');
    const posts = blogType === 'researchBlog' ? researchBlogPosts : personalBlogPosts;
    const post = posts.find(p => p.id === postId);
    if (post) {
        hideAllSections();
        blogPost.classList.remove('hidden');
        blogPost.innerHTML =
            `<div class="post-container">
                <h2>${post.title}</h2>
                <div class="post-meta">Posted on ${post.date} by ${post.author}</div>
                ${post.content.split('\n').map(paragraph => `<p>${paragraph}</p>`).join('')}
            </div>`;
        currentSection = 'blogPost';
        updateURL(blogType, postId);
    } else {
        console.error('Post not found:', postId);
        showSection('home');
    }
}

function showSection(sectionId) {
    hideAllSections();
    const element = document.getElementById(sectionId);
    if (element) {
        element.classList.remove('hidden');
        currentSection = sectionId;
        updateURL(sectionId);
    } else {
        console.error('Section not found:', sectionId);
        showSection('home');
    }
}

function hideAllSections() {
    const sections = ['home', 'researchBlog', 'personalBlog', 'aboutAndContact', 'blogPost'];
    sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.classList.add('hidden');
        }
    });
}

function updateURL(sectionId, postId) {
    let url = `#/${sectionId}`;
    if (postId) {
        url += `/${postId}`;
    }
    history.pushState(null, null, url);
}

function routeURL() {
    if (!dataLoaded) {
        console.log('Data not loaded yet, deferring routing');
        return;
    }

    const hash = window.location.hash.substring(1);
    const path = hash.split('/').filter(Boolean);

    switch (path.length) {
        case 0:
            showSection('home');
            break;
        case 1:
            showSection(path[0]);
            break;
        case 2:
            const section = path[0];
            const postId = path[1];
            if (section === 'researchBlog' || section === 'personalBlog') {
                showBlogPost(postId, section);
            } else {
                console.error('Invalid section:', section);
                showSection('home');
            }
            break;
        default:
            console.error('Invalid URL:', window.location.hash);
            showSection('home');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadBlogPosts();
});

window.addEventListener('popstate', () => {
    if (dataLoaded) {
        routeURL();
    } else {
        console.log('Data not loaded yet, deferring routing on popstate');
    }
});

window.addEventListener('load', () => {
    if (dataLoaded) {
        routeURL();
    } else {
        console.log('Data not loaded yet on window load, routing will occur after data loads');
    }
});