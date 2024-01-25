const express = require('express')
const router = express.Router()
const pool = require('../db')

const story = require('../data/story.json')

router.get('/', function (req, res) {
  console.log(story.parts[0])
  res.render('index.njk', { title: 'Welcome', part: story.parts[0] })
})

router.get('/story/:id', function (req, res) {
  const part = story.parts.find((part) => part.id === parseInt(req.params.id))
  if (!part) {
    res.status(404).render('404.njk', { title: '404' })
    return
  }
  res.render('part.njk', { title: part.name, part: part })
})

router.post('/username', function (req, res) {
  req.session.username = req.body.username
  console.log(req.session.username)
  res.redirect('/')
})

router.get('/dbtest/:id', async (req, res) => {
  try {
    const id = req.params.id
    const [parts] = await pool.promise().query(`SELECT * FROM mille_part WHERE id = ${id}`)                                                                             
    const [options] = await pool
      .promise()
      .query(`SELECT * FROM mille_option WHERE part_id = ${id}`)
    res.render('part.njk',{
      username: req.session.username,
      title: part.name,
      part,
    })
  }
  catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
})

module.exports = router
