const router = require('express').Router();
const User = require('../models/User');
const Thought = require('../models/Thought');

function isAuthenticated(req, res, next) {
  const isAuthenticated = req.session.user_id;

  if (!isAuthenticated) return res.redirect('/login');

  next();
}


// Add a thought
router.post('/thought', isAuthenticated, async (req, res) => {
  await Thought.create({
    title: req.body.title,
    text: req.body.text,
    createdAt: req.body.createdAt,
    userId: req.session.user_id,
    comment: req.body.comment
  });

  res.redirect('/dashboard');
});

//view thought route
router.get('/thought/:id', async (req, res) => {
  const thought_id = req.params.id;

  console.log('Thought ID:', thought_id); // Log the thought ID

  try {
    const thought = await Thought.findByPk(thought_id, {
      include: User // Include the associated User in the query
    });

    console.log('Thought:', thought); // Log the thought object

    if (!thought) {
      // If the thought with the given ID is not found, handle the error
      console.log('Thought not found');
      return res.status(404).send('Thought not found');
    }

    res.render('post', {
      isLoggedIn: req.session.user_id,
      thought: thought.get({ plain: true }), // Pass the selected thought as a single object
    });
  } catch (err) {
    // Handle any errors that occurred during database query
    console.error('Error fetching thought:', err);
    res.status(500).send('Server Error');
  }
});


// Add a comment to the thought
router.put('/thought/:id', async (req, res) => {
  try {
    const thoughtId = req.params.id;
    const comment = req.body.comment;

    console.log('Thought ID:', thoughtId); // Log the thought ID
    console.log('Comment Text:', comment); // Log the comment text

    // Check if the thought with the given ID exists
    const thought = await Thought.findByPk(thoughtId);
    if (!thought) {
      console.log('Thought not found');
      return res.json('Thought not found');
    }

    // Update the thought's comment with the new comment text
    thought.comment = comment;

    // Save the updated thought
    await thought.save();

    // Fetch the associated user and include the username in the response
    const user = await User.findByPk(thought.userId);
    if (!user) {
      console.log('User not found');
      return res.json('User not found');
    }

    console.log('Comment added to thought successfully');

    // Send the response with the updated thought data and the username
    res.json({
      id: thought.id,
      title: thought.title,
      text: thought.text,
      createdAt: thought.createdAt,
      updatedAt: thought.updatedAt,
      comment: thought.comment,
      userId: thought.userId,
      username: user.username // Include the username in the response to be able to display the username who added the comment
    });
  } catch (err) {
    // Handle any errors that occurred during the process
    console.error('Error adding comment to thought:', err);
    res.json('Server Error');
  }
});

// Route to display the selected thought on the edit thought template
router.get('/dashboard/:id', async (req, res) => {
  const thoughtId = req.params.id;

  try {
    // Find the thought with the given ID
    const thought = await Thought.findByPk(thoughtId);

    if (!thought) {
      // If the thought with the given ID is not found, handle the error
      console.log('Thought not found');
      return res.status(404).send('Thought not found');
    }

    // Render the editThought template to display the thought's details and allow editing
    res.render('editThought', {
      thought: thought.get({ plain: true }),
      isLoggedIn: req.session.user_id,

    });
  } catch (err) {
    // Handle any errors that occurred during the process
    console.error('Error fetching thought:', err);
    res.status(500).send('Server Error');
  }
});

// Route to update the thought on the /dashboard/:id route
router.put('/dashboard/:id', async (req, res) => {
  try {
    const thoughtId = req.params.id; // Retrieve the thought ID from the URL parameter
    const { title, text, comment } = req.body;

    console.log('Thought ID:', thoughtId); // Log the thought ID
    console.log('New Title:', title); // Log the updated title
    console.log('New Text:', text); // Log the updated text
    console.log('New Comment:', comment); // Log the updated comment

    // Check if the thought with the given ID exists
    const thought = await Thought.findByPk(thoughtId);
    if (!thought) {
      console.log('Thought not found');
      return res.json('Thought not found');
    }

    // Update the thought's properties with the new data
    thought.title = title;
    thought.text = text;
    thought.comment = comment; // Update the comment property with the new comment

    // Save the updated thought
    await thought.save();

    console.log('Thought updated successfully');

    // Send the updated thought data as a response in JSON format
    res.json({
      id: thought.id,
      title: thought.title,
      text: thought.text,
      createdAt: thought.createdAt,
      updatedAt: thought.updatedAt,
      comment: thought.comment, // Include the comment in the response
      userId: thought.userId,
    });
  } catch (err) {
    // Handle any errors that occurred during the process
    console.error('Error updating thought:', err);
    res.json('Server Error');
  }
});


// Route to delete the thought on the /dashboard/:id route
router.delete('/dashboard/:id', async (req, res) => {
  try {
    const thoughtId = req.params.id; // Retrieve the thought ID from the URL parameter

    console.log('Thought ID to delete:', thoughtId); // Log the thought ID

    // Check if the thought with the given ID exists
    const thought = await Thought.findByPk(thoughtId);
    if (!thought) {
      console.log('Thought not found');
      return res.json('Thought not found');
    }

    // Delete the thought from the database
    await thought.destroy();

    console.log('Thought deleted successfully');

    // Send a success response with the deleted thought ID
    res.json({ deletedThoughtId: thoughtId });
  } catch (err) {
    // Handle any errors that occurred during the process
    console.error('Error deleting thought:', err);
    res.json('Server Error');
  }
});



module.exports = router;