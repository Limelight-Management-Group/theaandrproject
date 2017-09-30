const bcrypt = require('bcrypt');

const pgp = require('pg-promise')();

if(process.env.NODE_ENV === 'production'){
  pgp.pg.defaults.ssl = true;
};

const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/theaandrproject';
const db = pgp(connectionString);

console.log('lockedAndLoaded')
const mqueries = {
  getAll() {
    return db.any('SELECT * FROM users');
  },
  create(user) {
    console.log('this is the user', user)
    return db.any(`
      INSERT INTO users(username, password, f_name, l_name, email, occupation, limelightObjective, image, location, age, bio) 
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `, [user.username, user.password, user.f_name, user.l_name, user.email, user.occupation, user.limelightObjective, user.image, user.location, user.age, user.bio])
    .catch(console.log)
  },
  delete(id) {
    return db.none('DELETE from users WHERE id = $1', [id]);
  },
  edited(id, user) {
    return db.any('UPDATE users SET user=$1 WHERE id = $2 RETURNING user', [user.title, user.id]);
  },
  getOneuser(user) {
    console.log('user from getOneuser', user)
    const result = db.one('SELECT * FROM users WHERE username = $1', [user.username]);
    console.log("this is the result: ", result)
    return result
  },
    getOnePhoto(photos) {
    console.log('photo from photos', photo)
    const result = db.one('SELECT * FROM users WHERE image = $1', [user.image]);
    console.log("this is the result: ", result)
    return result
  }
};

module.exports = mqueries;