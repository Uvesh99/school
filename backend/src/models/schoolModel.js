const db = require("../config/db");

const addSchool = (name, address, latitude, longitude, callback) => {
  const query = "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";
  db.query(query, [name, address, latitude, longitude], callback);
};

const getAllSchools = (callback) => {
  db.query("SELECT * FROM schools", callback);
};

module.exports = { addSchool, getAllSchools };
