const { Router } = require('express');
const controller = require('../controllers/project.controller');
const taskController = require('../controllers/task.controller');
const auth = require('../middlewares/auth.middleware');

const router = Router();

router.use(auth);

// Projetos
router.get('/', controller.getAll);
router.post('/', controller.create);
router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

// Membros do projeto
router.get('/:id/members', controller.getMembers);
router.post('/:id/members', controller.addMember);
router.delete('/:id/members/:userId', controller.removeMember);

// Tarefas do projeto
router.get('/:projectId/tasks', taskController.getByProject);
router.post('/:projectId/tasks', taskController.create);

module.exports = router;
