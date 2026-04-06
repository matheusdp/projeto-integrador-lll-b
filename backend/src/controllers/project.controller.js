const projectService = require('../services/project.service');
const memberService = require('../services/member.service');

async function getAll(req, res, next) {
  try {
    const projects = await projectService.getAll(req.user.id);
    res.json(projects);
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const project = await projectService.getById(req.params.id, req.user.id);
    res.json(project);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const project = await projectService.create(req.body, req.user.id);
    res.status(201).json(project);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const project = await projectService.update(req.params.id, req.body, req.user.id);
    res.json(project);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await projectService.remove(req.params.id, req.user.id);
    res.status(204).send();
  } catch (err) { next(err); }
}

async function getMembers(req, res, next) {
  try {
    const members = await memberService.getMembers(req.params.id, req.user.id);
    res.json(members);
  } catch (err) { next(err); }
}

async function addMember(req, res, next) {
  try {
    const member = await memberService.addMember(req.params.id, req.body, req.user.id);
    res.status(201).json(member);
  } catch (err) { next(err); }
}

async function removeMember(req, res, next) {
  try {
    await memberService.removeMember(req.params.id, req.params.userId, req.user.id);
    res.status(204).send();
  } catch (err) { next(err); }
}

module.exports = { getAll, getById, create, update, remove, getMembers, addMember, removeMember };
