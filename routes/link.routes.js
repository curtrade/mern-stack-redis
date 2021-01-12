const { Router } = require('express')
const config = require('config')
const { body, validationResult } = require('express-validator')
const shortid = require('shortid')
const Link = require('../models/Link')
const User = require('../models/User')
const auth = require('../middleware/auth.middleware')
const router = Router()
const { NotFound, BadRequest } = require('../modules/error-types')
const checkUrlValid = require('../modules/check-url-valid')

//instead of try...catch in every route
require('express-async-errors')

/**
 * @swagger
 * /link/generate:
 *  post:
 *   description: Use to generate new short link (JWT Bearer auth required)
 *   parameters:
 *    - name: from
 *      description: Source user's link
 *      type: string
 *      required: true
 *
 *   responses:
 *    201:
 *     description: Short link created
 *    400:
 *     description: Bad request
 *    404:
 *     description: User not found
 */
router.post(
    '/generate',
    [
        auth,
        body('from', 'URL не задан').custom((from) => {
            return from && from.length > 0
        }),
        body('from', 'URL некорректный').custom((from) => {
            return checkUrlValid(from)
        })
    ],
    async (req, res) => {
        const baseUrl = config.get('baseUrl')
        const redirectPrefix = config.get('redirectPrefix')
        const { from } = req.body

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            throw new BadRequest(errors.array()[0].msg, {
                errors: errors.array()
            })
        }

        const user = await User.findById(req.user.userId)
        let code

        if (!user) {
            throw new NotFound(
                'Сессия не найдена. На;мите "Очистить сессию" для того, чтобы создалась новая'
            )
        }

        if (user.subpart) {
            const linksCount = await Link.countDocuments({
                owner: req.user.userId
            })
            code = user.subpart + '-' + (linksCount + 1)
        } else {
            code = shortid.generate()
        }

        const existing = await Link.findOne({ from, owner: req.user.userId })
        if (existing) {
            return res.json({ link: existing })
        }
        let to = baseUrl + '/' + redirectPrefix + '/' + code

        const link = new Link({ code, to, from, owner: req.user.userId })

        await link.save()

        res.status(201).json({ link })
    }
)

/**
 * @swagger
 * /link:
 *  get:
 *   description: Use to get all user's links (JWT Bearer auth required)
 *   parameters:
 *   responses:
 *    200:
 *     description: links returned
 */
router.get('/', auth, async (req, res) => {
    const links = await Link.find({ owner: req.user.userId })
    res.json(links)
})

/**
 * @swagger
 * /link/[id]:
 *  get:
 *   description: Use to get user's link by id (JWT Bearer auth required)
 *   parameters:
 *   - name: id
 *     description: link id
 *     required: true
 *     type: string
 *   responses:
 *    200:
 *     description: link returned
 */
router.get('/:id', auth, async (req, res) => {
    const link = await Link.findById(req.params.id)
    res.json(link)
})

module.exports = router
