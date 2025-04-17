document.addEventListener('DOMContentLoaded', () => {
    const postListContainer = document.getElementById('postListContainer');

    if (!postListContainer) {
        console.error("Element with ID 'postListContainer' not found.");
        return;
    }

    const path = window.location.pathname;
    let pageType = '';
    if (path.includes('/research.html')) {
        pageType = 'research';
    } else if (path.includes('/personal.html')) {
        pageType = 'personal';
    } else {
        console.error('Could not determine blog type from URL path:', path);
        postListContainer.innerHTML = '<p>Error: Could not determine blog type.</p>';
        return;
    }

    const jsonPath = `/data/${pageType}-posts.json`;

    fetch(jsonPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} for ${jsonPath}`);
            }
            return response.json();
        })
        .then(posts => {
            if (!posts || !Array.isArray(posts)) {
                 throw new Error(`Invalid data loaded from ${jsonPath}`);
            }

            if (posts.length === 0) {
                postListContainer.innerHTML = '<p>No posts found yet!</p>';
                return;
            }

            const postsHtml = posts.map(post => {
                const postUrl = `/${pageType}/${post.id}.html`;
                const imageUrl = post.imageUrl ?
                    `<div class="post-image"><a href="${postUrl}"><img src="${post.imageUrl}" alt="${post.title}"></a></div>` : '';

                if (!post.id || !post.title || !post.date || !post.author || !post.summary) {
                    console.warn('Skipping post due to missing data:', post);
                    return '';
                }

                return `
                    <article class="post">
                        <div class="post-content">
                            <h2><a href="${postUrl}">${post.title}</a></h2>
                            <div class="post-meta">Posted on ${post.date} by ${post.author}</div>
                            <p>${post.summary}</p>
                        </div>
                        ${imageUrl}
                    </article>`;
            }).join('');

            postListContainer.innerHTML = postsHtml;
        })
        .catch(error => {
            console.error(`Error loading ${pageType} posts:`, error);
            postListContainer.innerHTML = `<p>Error loading posts. Please check the console for details.</p>`;
        });
});