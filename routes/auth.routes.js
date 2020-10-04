const { Router } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')
const User = require('../models/user')
const router = Router(); 

// /api/auth/register
router.post(
  '/register',
  [
    check('email', 'Incorrect email').isEmail(),
    check('password', 'Min pass length').isLength({ min: 6 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          errors: errors.array(),
          message: 'Incorrect registration data'
        })
      } 

      const { email, password } = req.body
      const condidate = await User.findOne({ email })

      if (condidate) {
        return res.status(400).json({ message: 'Email exists in system'})
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ email, password: hashedPassword})

      await user.save();

      res.status(201).json({ message: 'User created'})

    } catch(e) {
      console.log(e)
      res.status(500).json({ message: 'Smth went wrong, try again'})
    }
  })

// /api/auth/login
router.post(
  '/login',
  [
    check('email', 'Enter correct email').normalizeEmail().isEmail(),
    check('password', 'Enter pass').exists()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty) {
        return res.status(400).json({ 
          errors: errors.array(),
          message: 'Incorrect login data'
        })
      }

      const { email, password } = req.body

      const user = await User.findOne({ email })

      if (!user) {
        return res.status(400).json({ message: 'User not found'})
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res.status(400).json({ message: 'Wrong pass '})
      }

      const token = jwt.sign(
        { userId: user.id},
        config.get('jwtSecret'),
        { expiresIn: '1h' }
      )

      res.json({ token, userId: user.id })

    } catch(e) {
      res.status(500).json({ message: 'Smth went wrong, try again'})
    }
})

module.exports = router;