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

    //Add the username to the thought route using optional chaining
    const username = thought?.User?.username;

    res.render('post', {
      isLoggedIn: req.session.user_id,
      thought: thought.get({ plain: true }), // Pass the selected thought as a single object
      username: username // Pass the username to the view
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

    console.log('Comment added to thought successfully');

    res.json(thought);
  } catch (err) {
    // Handle any errors that occurred during the process
    console.error('Error adding comment to thought:', err);
    res.json('Server Error');
  }
});


module.exports = router;