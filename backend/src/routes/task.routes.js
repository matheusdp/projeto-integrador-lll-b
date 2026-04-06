const { Router } = require('express');
const controller = require('../controllers/task.controller');
const auth = require('../middlewares/auth.middleware');

const router = Router();

router.use(auth);

router.put('/:id', controller.update);
router.patch('/:id/status', controller.updateStatus);
router.delete('/:id', controller.remove);

module.exports = router;
