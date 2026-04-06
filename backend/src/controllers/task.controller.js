const taskService = require('../services/task.service');

async function getByProject(req, res, next) {
  try {
    const tasks = await taskService.getByProject(req.params.projectId, req.user.id);
    res.json(tasks);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const task = await taskService.create(req.body, req.params.projectId, req.user.id);
    res.status(201).json(task);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const task = await taskService.update(req.params.id, req.body, req.user.id);
    res.json(task);
  } catch (err) { next(err); }
}

async function updateStatus(req, res, next) {
  try {
    const task = await taskService.updateStatus(req.params.id, req.body, req.user.id);
    res.json(task);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await taskService.remove(req.params.id, req.user.id);
    res.status(204).send();
  } catch (err) { next(err); }
}

module.exports = { getByProject, create, update, updateStatus, remove };
