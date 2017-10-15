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
      INSERT INTO users(username, password, f_name, l_name, email, occupation, limelightObjective, image, location, age, bio, user_sid) 
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `, [user.username, user.password, user.f_name, user.l_name, user.email, user.occupation, user.limelightObjective, user.image, user.location, user.age, user.bio, user.user_sid])
    .catch(console.log)
  },
  delete(id) {
    return db.none('DELETE from users WHERE id = $1', [id]);
  },
  edited(id, user) {
    return db.any('UPDATE users SET user=$1 WHERE id = $2 RETURNING user', [user.title, user.id]);
  },
  getOneuser(user) {
    // console.log('user from getOneuser', user)
    const result = db.one('SELECT * FROM users WHERE username = $1', [user.username]);
    // console.log("this is the result: ", result)
    return result
  },
    getOnePhoto(photos) {
    console.log('photo from photos', photo)
    const result = db.one('SELECT * FROM users WHERE image = $1', [user.image]);
    console.log("this is the result: ", result)
    return result
  },
  findOneUser(user){
    console.log('this is the user', user)
    return db.one('SELECT * FROM users WHERE user_sid = $1', [user.user_sid]);
  }, 
  creatNewPost(post){
    // console.log('post from user', post.message)
    return db.any(`
      INSERT INTO messages(sender, message) 
      VALUES($1, $2)
      `, [post.sender, post.message])
      .catch(console.log)
  },
  findAllPostByUser(sender){
    console.log('this is the sender', sender)
    return db.any(`SELECT message FROM messages WHERE sender = $1`, [sender.sender]);
  },
  findUserAndAllUserPosts(users){
    // console.log('the UserObject', users)
    let result = db.any(`SELECT username, password, message, created_at, updated_at FROM users 
      JOIN messages 
      ON users.user_sid = messages.sender
      WHERE username = $1`, users.username)
    // console.log(result, '<-----')
    return result
  },
    findUserAndAllUserPostsById(user_sid){
    console.log('the UserObject', user_sid)
    let result = db.any(`SELECT username, password, message, created_at, updated_at FROM users 
      JOIN messages 
      ON users.user_sid = messages.sender
      WHERE messages.sender = $1`, user_sid)
    // console.log(result, '<-----')
    return result
  }
};
// mqueries.findUserAndAllUserPostsById('s:dtzPVP7pXTYc3NDj_Ih2v_R9svhe-bVO.GLJqmyUyUuOMk30XP67RyoSVLJvpxpfnSu9NbW2InHc')
// .then(posts=>console.log('these are posts--->', posts))
module.exports = mqueries;