document.addEventListener('DOMContentLoaded', () => {
    const latestResearchContainer = document.getElementById('latestResearchPost');
    const latestPersonalContainer = document.getElementById('latestPersonalPost');

    const fetchLatest = (postType, container) => {
        fetch(`/data/${postType}-posts.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(posts => {
                if (posts && posts.length > 0) {
                    const latestPost = posts[0];
                    const postUrl = `/${postType}/${latestPost.id}.html`;
                    const imageUrl = latestPost.imageUrl ?
                        `<div class="post-image"><a href="${postUrl}"><img src="${latestPost.imageUrl}" alt="${latestPost.title}"></a></div>` : '';

                    const typeString = postType === 'research' ? 'Research' : 'Personal';

                    container.innerHTML = `
                        <article class="post">
                            <div class="post-content">
                                <h2><a href="${postUrl}">${latestPost.title}</a></h2>
                                 <div class="post-meta">Latest <strong>${typeString}</strong> Blog Post. Posted on ${latestPost.date} by ${latestPost.author}</div>
                                <p>${latestPost.summary}</p>
                            </div>
                            ${imageUrl}
                        </article>`;
                } else {
                    container.innerHTML = `<p>No ${postType} posts yet.</p>`;
                }
            })
            .catch(error => {
                console.error(`Error loading latest ${postType} post:`, error);
                container.innerHTML = `<p>Could not load latest ${postType} post. Check console for details.</p>`;
            });
    };

    if (latestResearchContainer) {
        fetchLatest('research', latestResearchContainer);
    } else {
        console.error("Element with ID 'latestResearchPost' not found.");
    }

    if (latestPersonalContainer) {
        fetchLatest('personal', latestPersonalContainer);
    } else {
        console.error("Element with ID 'latestPersonalPost' not found.");
    }
});