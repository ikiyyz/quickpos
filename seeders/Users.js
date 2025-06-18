const { Pool } = require("pg");
const { generatePassword } = require("../helpers/utils");

const pool = new Pool({
  user: "riski",
  password: "todopassword",
  host: "localhost",
  port: 5432,
  database: "posdb",
});

(async () => {
  const email = 'maharinirani0@gmail.com';
  const name = 'iki';
  const plainPassword = '123';
  const role = 'user';

  const hashed = generatePassword(plainPassword);

  try {
    await pool.query(
      `INSERT INTO users (email, name, password, role) VALUES ($1, $2, $3, $4)`,
      [email, name, hashed, role]
    );
    console.log("User berhasil ditambahkan!");
  } catch (err) {
    console.error("Gagal menambahkan user:", err.message);
  } finally {
    pool.end();
  }
})();
