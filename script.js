
// script.js

function createPost() {
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;
    const tags = document.getElementById('post-tags').value.split(',').map(tag => tag.trim());

    const newPost = {
        title,
        body: content,
        tags,
        reactions: 0
    };

    // Insert the new post at the beginning of the postContainer
    appendPost(newPost, true);
}

function appendPost(post, atBeginning = false) {
    const postContainer = document.getElementById("dummy-post");

    const postDiv = document.createElement("div");
    postDiv.classList.add("post-divs-json");

    postDiv.innerHTML = `
        <h1 class="post-divs-text">${post.title}</h1>
        <p class="post-divs-text">${post.body}</p>
        <p class="post-tags">Tags: ${post.tags.join(", ")}</p>
        <p class="post-reactions">Reactions: ${post.reactions}</p>
        <button class="like-button">Like</button>
    `;

    if (atBeginning) {
        postContainer.insertBefore(postDiv, postContainer.firstChild);
    } else {
        postContainer.appendChild(postDiv);
    }

    // Add event listener for the "Like" button
    const likeButton = postDiv.querySelector(".like-button");
    likeButton.addEventListener("click", function () {
        // Implement your logic for handling the like button click
        alert(`Liked the post: ${post.title}`);
        console.log("Liked the post.");
    });
}

document.addEventListener("DOMContentLoaded", function () {
    // Fetch posts from the API
    fetch("https://dummyjson.com/posts")
        .then((res) => res.json())
        .then((data) => {
            // Check if the posts are nested inside an object
            const posts = Array.isArray(data) ? data : data.posts || [];

            // Loop through the posts and append them to the postContainer
            posts.forEach((post) => {
                appendPost(post);
            });
        })
        .catch((error) => console.error("Error fetching posts:", error));

    // Add event listener for the "Create Post" button
    document.getElementById('create-post-button').addEventListener('click', createPost);
});
