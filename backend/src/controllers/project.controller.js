export function listProjects(req, res) {
  res.status(501).json({ message: 'Project listing scaffolded. Connect this to the Project model next.' });
}
export function createProject(req, res) {
  res.status(501).json({ message: 'Project creation requires authenticated user middleware.' });
}
export function getProject(req, res) {
  res.status(501).json({ message: 'Project detail endpoint scaffolded.' });
}
