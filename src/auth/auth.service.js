require('dotenv').config();
const { create, getAll } = require('../database/queries/crud')
const { existsByColumn, findByColumn } = require('../database/queries/others')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const tokenBlacklist = require('../utils/tokenBlacklist')

const JWT_SECRET = process.env.JWT_SECRET; 
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

async function verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

async function register(data){
    const {name, email, password, role } = data

    const allowedRole = ['admin', 'user']
    const finalRole = allowedRole.includes(role) ? role : 'user'
    const hashedPassword = await bcrypt.hash(password, 8)

    const emailExists = await existsByColumn('users', 'email', email)
    if (emailExists) {
        throw new Error('Email already registered')
    }

    const user = await create('users', {
        name, 
        email, 
        password: hashedPassword, 
        role: finalRole
    })
    return user
}

async function login(email, password){
    const user = await findByColumn(
        'users',
        'email',
        email,
        ['id', 'name', 'email', 'password', 'role']
    )

    if (!user) {
        throw new Error('Invalid email or password')
    }

    const isMatch = await verifyPassword(password, user.password)
    if (!isMatch) {
        throw new Error('Invalid email or password')
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role,
        },
            JWT_SECRET,
        { 
            expiresIn: JWT_EXPIRES_IN 
        }
    )

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    }
}


async function getAllUsers(){
    return await getAll('users')
}

async function logout(token) {
  if (!token) {
    throw new Error('Token is required');
  }
  tokenBlacklist.add(token);
}

module.exports = {
    login, 
    logout,
    register,
    getAllUsers,
}