document.addEventListener("DOMContentLoaded", function () {
    // Fetch posts from local storage
    const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];

    // Display stored posts from local storage
    if (storedPosts.length > 0) {
        storedPosts.forEach((post) => {
            appendPost(post);
        });
    }

    // Fetch posts from the API
    fetch("https://dummyjson.com/posts")
        .then((res) => res.json())
        .then((data) => {
            // Check if the posts are nested inside an object
            const posts = Array.isArray(data) ? data : data.posts || [];

            // Display posts from the API
            posts.forEach((post) => {
                appendPost(post);
            });
        })
        .catch((error) => console.error("Error fetching posts:", error));

    // Add event listener for the "Create Post" button
    document.getElementById('create-post-button').addEventListener('click', createPost);
});

function createPost(event) {
    event.preventDefault(); // Prevents the default form submission behavior

    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;
    const tags = document.getElementById('post-tags').value.split(',').map(tag => tag.trim());

    const newPost = {
        title,
        body: content,
        tags,
        reactions: 0
    };

    // Put the new post at the beginning of the postContainer
    appendPost(newPost, true);

    // Save the posts to local storage
    savePostsToLocalStorage();
}

// APPEND POST
function appendPost(post, atBeginning = false) {
    const postContainer = document.getElementById("dummy-post");

    const postDiv = document.createElement("div");
    postDiv.classList.add("post-divs-json");

    postDiv.innerHTML = `
        <h2 class="post-divs-text">${post.title}</h2>
        <p class="post-divs-text">${post.body}</p>
        <p class="post-tags">Tags: ${post.tags.join(", ")}</p>
        <p class="post-reactions">Reactions: <span class="reaction-count">${post.reactions}</span></p>
        <button class="like-button">Like</button>
        <button class="remove-button">Remove</button>
    `;

    if (atBeginning) {
        postContainer.insertBefore(postDiv, postContainer.firstChild);
    } else {
        postContainer.appendChild(postDiv);
    }

    // Add event listener for the "Like" button
    const likeButton = postDiv.querySelector(".like-button");
    likeButton.addEventListener("click", function () {
        post.reactions++;
        const reactionCountElement = postDiv.querySelector(".reaction-count");
        reactionCountElement.textContent = post.reactions;

        // Save the posts to local storage after a like
        savePostsToLocalStorage();
        // TEST
        console.log("Liked the post.");
    });

    // Add event listener for the "Remove" button
    const removeButton = postDiv.querySelector(".remove-button");
    removeButton.addEventListener("click", function () {
        // Remove the post from the display
        postContainer.removeChild(postDiv);

        // Remove the post from local storage
        removePostFromLocalStorage(post);

        alert("Removed a post.");
        console.log("Removed a post.");
    });
}

function removePostFromLocalStorage(postToRemove) {
    // Get all postDiv elements and extract post data
    const postDivs = document.querySelectorAll('.post-divs-json');
    const posts = Array.from(postDivs).map(postDiv => {
        return {
            title: postDiv.querySelector('.post-divs-text').textContent,
            body: postDiv.querySelector('.post-divs-text:nth-child(2)').textContent,
            tags: postDiv.querySelector('.post-tags').textContent.replace('Tags: ', '').split(', ').map(tag => tag.trim()),
            reactions: parseInt(postDiv.querySelector('.reaction-count').textContent)
        };
    });

    // Remove the specified post from the array
    const updatedPosts = posts.filter(post => post.title !== postToRemove.title);

    // Save the updated posts to local storage
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
}

function savePostsToLocalStorage() {
    // Get all postDiv elements and extract post data
    const postDivs = document.querySelectorAll('.post-divs-json');
    const posts = Array.from(postDivs).map(postDiv => {
        return {
            title: postDiv.querySelector('.post-divs-text').textContent,
            body: postDiv.querySelector('.post-divs-text:nth-child(2)').textContent,
            tags: postDiv.querySelector('.post-tags').textContent.replace('Tags: ', '').split(', ').map(tag => tag.trim()),
            reactions: parseInt(postDiv.querySelector('.reaction-count').textContent)
        };
    });

    // Save the posts to local storage
    localStorage.setItem('posts', JSON.stringify(posts));
}
