class TokenBlacklist {
  constructor() {
    this.blacklisted = new Set();
  }

  add(token) {
    this.blacklisted.add(token);
  }

  has(token) {
    return this.blacklisted.has(token);
  }

  delete(token) {
    this.blacklisted.delete(token);
  }

  clear() {
    this.blacklisted.clear();
  }
}

module.exports = new TokenBlacklist();