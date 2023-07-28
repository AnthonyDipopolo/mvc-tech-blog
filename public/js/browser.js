// Function to delete the thought from the dashboard
function deleteThoughtFromDashboard(deletedThoughtId) {
  const thoughtCard = document.querySelector(`[data-thought-id="${deletedThoughtId}"]`);
  thoughtCard.remove();
}


// Event listener for the update thought button in the modal
const updateThoughtButton = document.getElementById('updateThoughtButton');
updateThoughtButton.addEventListener('click', () => {
  const thoughtId = updateThoughtButton.getAttribute('data-thought-id');
  const newTitle = document.querySelector('input[name="title"]').value;
  const newText = document.querySelector('input[name="text"]').value;

  // Perform the fetch request to update the thought
  fetch(`/dashboard/${thoughtId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title: newTitle, text: newText })
  })
  .then(response => response.json())
  .then(updatedThought => {
    // Use template literals to update the thought on the dashboard
    const thoughtCard = document.querySelector(`[data-thought-id="${updatedThought.id}"]`);
    if (thoughtCard) {
      thoughtCard.innerHTML = `
        <h2>
          <a href="/dashboard/${updatedThought.id}">${updatedThought.title}</a>
        </h2>
        <p>${updatedThought.text}</p>
        <p>Created On: ${updatedThought.createdAt}</p>
      `;
    } else {
      console.error(`Thought card with ID ${updatedThought.id} not found on the dashboard.`);
    }

    // Redirect the user back to the updated dashboard
    window.location.href = '/dashboard';
  })
  .catch(error => {
    console.error('Error updating thought:', error);
  });
});


  // Event listener for the delete forms
const deleteForms = document.querySelectorAll('.delete-form');
deleteForms.forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const thoughtId = form.getAttribute('action').split('/').pop(); // Extract the thought ID from the form action URL

    // Perform the fetch request to delete the thought
    fetch(`/dashboard/${thoughtId}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.status === 200) {
        // Delete the thought from the dashboard
        deleteThoughtFromDashboard(thoughtId);
        
        // Redirect the user back to the updated dashboard
        window.location.href = '/dashboard';

      } else {
        console.error('Error deleting thought:', response.statusText);
      }
    })
    .catch(error => {
      console.error('Error deleting thought:', error);
    });
  });
});