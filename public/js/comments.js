// Function to submit the comment form
function submitForm() {
    const thoughtId = "{{thought.id}}";
    const commentInput = document.querySelector('[name="comment"]');
    const commentText = document.querySelector('[name="comment"]').value;

    fetch(`/thought/${thoughtId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ comment: commentText })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // Display the fetched data in the browser
      const fetchedDataContainer = document.getElementById('fetchedDataContainer');

      fetchedDataContainer.innerHTML = `
        <h2>${data.title}</h2>
        <p>${data.text}</p>
        <div class="comments">
          <p>Comment: ${data.comment || ''}</p><br>
          <p>Added By:${data.username}</p>
          <p>Created On: ${data.updatedAt}</p><br>


        </div>
      `;

       // Empty the comment input box
      commentInput.value = '';
    })
    .catch(error => {
      console.error('Error:', error);
    });
};

// Prevent default form submission
document.getElementById('commentForm').addEventListener('submit', function(event) {
    event.preventDefault();
  });