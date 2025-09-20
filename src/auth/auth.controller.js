const authService = require('./auth.service')

async function register(req, res) {
    try {
        const user = await authService.register(req.body)
        res.status(201).json({ message: 'User created', user})
    }catch (err) {
        res.status(400).json({ error: err.message })
    }
}

async function login(req, res) {
    try{
        const { email, password } = req.body
        const result = await authService.login(email, password)
        res.json(result)
    }catch (err) {
        res.status(401).json({ error: err.message })
    }
}

async function logout(req, res) {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(400).json({ error: 'Token required' });
    }

    await authService.logout(token);

    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listUsers(req, res) {
    try {
        const users = await authService.getAllUsers();
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}

module.exports = {
    register, 
    login,
    logout,
    listUsers
}