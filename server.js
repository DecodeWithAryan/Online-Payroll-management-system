// // ===============================
// // PAYROLL MANAGEMENT SYSTEM - FINAL
// // Backend: Node + Express + MySQL
// // ===============================

// //2
// require("dotenv").config();


// const express = require("express");
// // const mysql = require("mysql2");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const path = require("path");

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // PUBLIC FOLDER
// const PUBLIC_DIR = path.join(__dirname, "public");

// // 1) Serve static HTML files FIRST
// app.use(express.static(PUBLIC_DIR));

// // 2) Root route → auth.html (login/register page)
// app.get("/", (req, res) => {
//   res.sendFile(path.join(PUBLIC_DIR, "auth.html"));
// });


// //3
// // ===============================
// // DATABASE CONNECTION
// // ===============================
// // const db = mysql.createConnection({
// //   host: "localhost",
// //   user: "root",
// //   password: "ARYANsingh#5",
// //   database: "payrolldb"
// // });

// require("dotenv").config();
// const mysql = require("mysql2/promise");

// const db = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME
// });



// //4
// // db.connect(err => {
// //   if (err) {
// //     console.log("❌ SQL ERROR:", err);
// //   } else {
// //     console.log("✔ SQL Connected Successfully");
// //   }
// // });

// //4
// (async () => {
//   try {
//     await db.getConnection();
//     console.log("✔ SQL Connected Successfully");
//   } catch (err) {
//     console.log("❌ SQL ERROR:", err);
//   }
// })();



// const SECRET = "NEHA_2025_SECRET";

// // Helper Query Function
// function q(sql, params = []) {
//   return new Promise((resolve, reject) => {
//     db.query(sql, params, (err, rows) => {
//       if (err) reject(err);
//       else resolve(rows);
//     });
//   });
// }

// // ===============================
// // AUTH MIDDLEWARE
// // ===============================
// function auth(req, res, next) {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "No Token Found" });

//   try {
//     const decoded = jwt.verify(token, SECRET);
//     req.user = decoded;
//     next();
//   } catch {
//     return res.status(401).json({ message: "Invalid Token" });
//   }
// }

// // ===============================
// // AUTH ROUTES
// // ===============================

// // REGISTER
// app.post("/api/register", async (req, res) => {
//   const { name, email, password, role } = req.body;

//   try {
//     const hash = bcrypt.hashSync(password, 10);

//     await q(
//       "INSERT INTO users(name,email,password,role) VALUES (?,?,?,?)",
//       [name, email, hash, role || "employee"]
//     );

//     res.json({ message: "Registered Successfully" });
//   } catch (err) {
//     if (err.code === "ER_DUP_ENTRY")
//       return res.json({ message: "Email already exists" });

//     console.error(err);
//     res.json({ message: "Registration Failed" });
//   }
// });

// // LOGIN
// app.post("/api/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const rows = await q("SELECT * FROM users WHERE email=?", [email]);

//     if (rows.length === 0)
//       return res.json({ message: "User not found" });

//     const user = rows[0];
//     const ok = bcrypt.compareSync(password, user.password);

//     if (!ok)
//       return res.json({ message: "Wrong Password" });

//     const token = jwt.sign(
//       { id: user.id, name: user.name, role: user.role },
//       SECRET,
//       { expiresIn: "10h" }
//     );

//     res.json({ token, user });

//   } catch (err) {
//     console.error(err);
//     res.json({ message: "Login Failed" });
//   }
// });

// // ===============================
// // EMPLOYEE CRUD
// // ===============================

// // GET EMPLOYEES
// app.get("/api/employees", auth, async (req, res) => {
//   const rows = await q("SELECT * FROM employees ORDER BY id DESC");
//   res.json({ employees: rows });
// });

// // ADD EMPLOYEE
// app.post("/api/employees", auth, async (req, res) => {
//   const { name, email, department, basic_salary } = req.body;

//   try {
//     await q(
//       "INSERT INTO employees(name,email,department,basic_salary) VALUES (?,?,?,?)",
//       [name, email, department, basic_salary]
//     );

//     res.json({ message: "Employee Added" });

//   } catch (err) {
//     console.log("ADD EMPLOYEE ERROR:", err);
//     res.json({ message: "Error adding employee" });
//   }
// });

// // UPDATE EMPLOYEE
// app.put("/api/employees/:id", auth, async (req, res) => {
//   const { name, email, department, basic_salary } = req.body;

//   try {
//     await q(
//       "UPDATE employees SET name=?, email=?, department=?, basic_salary=? WHERE id=?",
//       [name, email, department, basic_salary, req.params.id]
//     );

//     res.json({ message: "Employee Updated" });

//   } catch (err) {
//     console.log("UPDATE ERROR:", err);
//     res.json({ message: "Error updating employee" });
//   }
// });

// // DELETE EMPLOYEE
// app.delete("/api/employees/:id", auth, async (req, res) => {
//   try {
//     await q("DELETE FROM employees WHERE id=?", [req.params.id]);
//     res.json({ message: "Employee Deleted" });
//   } catch (err) {
//     console.log("DELETE ERROR:", err);
//     res.json({ message: "Error deleting employee" });
//   }
// });

// // ===============================
// // ATTENDANCE
// // ===============================

// app.post("/api/attendance", auth, async (req, res) => {
//   const { employee_id, date, status } = req.body;

//   try {
//     await q(
//       "INSERT INTO attendance(employee_id,date,status) VALUES (?,?,?)",
//       [employee_id, date, status]
//     );

//     res.json({ message: "Attendance Marked" });

//   } catch (err) {
//     console.log("ATTENDANCE ERROR:", err);
//     res.json({ message: "Error marking attendance" });
//   }
// });

// app.get("/api/attendance", auth, async (req, res) => {
//   try {
//     const rows = await q(`
//       SELECT a.*, e.name 
//       FROM attendance a 
//       JOIN employees e ON a.employee_id = e.id 
//       ORDER BY a.id DESC
//     `);

//     res.json({ records: rows });

//   } catch (err) {
//     console.log("ATTENDANCE LIST ERROR:", err);
//     res.json({ message: "Error loading attendance" });
//   }
// });

// // DASHBOARD STATS
// app.get("/api/stats", auth, async (req, res) => {
//   try {
//     const emp = await q("SELECT COUNT(*) AS total FROM employees");
//     const pay = await q("SELECT COUNT(*) AS total FROM payroll");
//     const att = await q("SELECT COUNT(*) AS total FROM attendance");

//     res.json({
//       employees: emp[0].total,
//       payrolls: pay[0].total,
//       attendance: att[0].total
//     });

//   } catch (err) { 
//     res.status(500).json({ message: "Error loading stats" }); 
//   }
// });


// // ===============================
// // PAYROLL
// // ===============================

// // app.post("/api/payroll", auth, async (req, res) => {
// //   const employees = await q("SELECT * FROM employees");
// //   const month = new Date().toISOString().slice(0, 7);

// //   for (let e of employees) {
// //     const basic = Number(e.basic_salary);
// //     const hra = basic * 0.15;
// //     const da = basic * 0.05;
// //     const pf = basic * 0.10;
// //     const tds = basic * 0.03;
// //     const net = basic + hra + da - pf - tds;

// //     await q(
// //       "INSERT INTO payroll(employee_id,month,basic,hra,da,pf,tds,net_salary) VALUES (?,?,?,?,?,?,?,?)",
// //       [e.id, month, basic, hra, da, pf, tds, net]
// //     );
// //   }

// //   res.json({ message: "Payroll Generated for " + month });
// // });

// app.post("/api/payroll", auth, async (req, res) => {
//   const month = new Date().toISOString().slice(0, 7);  // YYYY-MM

//   // Get all employees
//   const employees = await q("SELECT * FROM employees");

//   let countNew = 0;

//   for (let e of employees) {

//     // ❗ Check if payroll for this employee already exists for this month
//     const existing = await q(
//       "SELECT id FROM payroll WHERE employee_id = ? AND month = ?",
//       [e.id, month]
//     );

//     if (existing.length > 0) {
//       // Already generated → skip
//       continue;
//     }

//     // Calculate components
//     const basic = Number(e.basic_salary);
//     const hra = basic * 0.15;
//     const da = basic * 0.05;
//     const pf = basic * 0.10;
//     const tds = basic * 0.03;
//     const net = basic + hra + da - pf - tds;

//     // Insert new payroll
//     await q(
//       "INSERT INTO payroll(employee_id,month,basic,hra,da,pf,tds,net_salary) VALUES (?,?,?,?,?,?,?,?)",
//       [e.id, month, basic, hra, da, pf, tds, net]
//     );

//     countNew++;
//   }

//   if (countNew === 0) {
//     res.json({ message: "✔ Payroll already generated for all employees this month." });
//   } else {
//     res.json({ message: `✔ Payroll generated for ${countNew} new employee(s).` });
//   }
// });



// app.get("/api/payroll", auth, async (req, res) => {
//   const rows = await q(
//     "SELECT p.*, e.name FROM payroll p JOIN employees e ON p.employee_id=e.id ORDER BY p.id DESC"
//   );
//   res.json({ payrolls: rows });
// });

// // ===============================
// // START SERVER
// // ===============================
// // app.listen(3000, () => {
// //   console.log("✔ Server Running on http://localhost:3000");
// // });


// //1
// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`✔ Server Running on PORT ${PORT}`);
// });





// ===============================
// PAYROLL MANAGEMENT SYSTEM - FINAL
// Backend: Node + Express + MySQL
// ===============================

const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// PUBLIC FOLDER
const PUBLIC_DIR = path.join(__dirname, "public");

// Serve static HTML files
app.use(express.static(PUBLIC_DIR));

// Root route → auth.html
app.get("/", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "auth.html"));
});

// ===============================
// DATABASE CONNECTION (Render + Railway)
// ===============================

const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  waitForConnections: true,
  connectionLimit: 10,
});

// TEST CONNECTION
(async () => {
  try {
    await db.getConnection();
    console.log("✔ SQL Connected Successfully (Railway DB)");
  } catch (err) {
    console.log("❌ SQL ERROR:", err);
  }
})();

const SECRET = "NEHA_2025_SECRET";

// Query helper
function q(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params)
      .then(result => resolve(result[0]))
      .catch(err => reject(err));
  });
}

// ===============================
// AUTH MIDDLEWARE
// ===============================
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No Token Found" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid Token" });
  }
}

// ===============================
// AUTH ROUTES
// ===============================

// REGISTER
app.post("/api/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const hash = bcrypt.hashSync(password, 10);

    await q(
      "INSERT INTO users(name,email,password,role) VALUES (?,?,?,?)",
      [name, email, hash, role || "employee"]
    );

    res.json({ message: "Registered Successfully" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY")
      return res.json({ message: "Email already exists" });

    res.json({ message: "Registration Failed" });
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const rows = await q("SELECT * FROM users WHERE email=?", [email]);

    if (rows.length === 0)
      return res.json({ message: "User not found" });

    const user = rows[0];
    const ok = bcrypt.compareSync(password, user.password);

    if (!ok)
      return res.json({ message: "Wrong Password" });

    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      SECRET,
      { expiresIn: "10h" }
    );

    res.json({ token, user });

  } catch {
    res.json({ message: "Login Failed" });
  }
});

// ===============================
// EMPLOYEE CRUD
// ===============================

app.get("/api/employees", auth, async (req, res) => {
  const rows = await q("SELECT * FROM employees ORDER BY id DESC");
  res.json({ employees: rows });
});

app.post("/api/employees", auth, async (req, res) => {
  const { name, email, department, basic_salary } = req.body;

  try {
    await q(
      "INSERT INTO employees(name,email,department,basic_salary) VALUES (?,?,?,?)",
      [name, email, department, basic_salary]
    );

    res.json({ message: "Employee Added" });

  } catch {
    res.json({ message: "Error adding employee" });
  }
});

app.put("/api/employees/:id", auth, async (req, res) => {
  const { name, email, department, basic_salary } = req.body;

  try {
    await q(
      "UPDATE employees SET name=?, email=?, department=?, basic_salary=? WHERE id=?",
      [name, email, department, basic_salary, req.params.id]
    );

    res.json({ message: "Employee Updated" });

  } catch {
    res.json({ message: "Error updating employee" });
  }
});

app.delete("/api/employees/:id", auth, async (req, res) => {
  try {
    await q("DELETE FROM employees WHERE id=?", [req.params.id]);
    res.json({ message: "Employee Deleted" });
  } catch {
    res.json({ message: "Error deleting employee" });
  }
});

// ===============================
// ATTENDANCE
// ===============================

app.post("/api/attendance", auth, async (req, res) => {
  const { employee_id, date, status } = req.body;

  try {
    await q(
      "INSERT INTO attendance(employee_id,date,status) VALUES (?,?,?)",
      [employee_id, date, status]
    );

    res.json({ message: "Attendance Marked" });

  } catch {
    res.json({ message: "Error marking attendance" });
  }
});

app.get("/api/attendance", auth, async (req, res) => {
  try {
    const rows = await q(`
      SELECT a.*, e.name 
      FROM attendance a 
      JOIN employees e ON a.employee_id = e.id 
      ORDER BY a.id DESC
    `);

    res.json({ records: rows });

  } catch {
    res.json({ message: "Error loading attendance" });
  }
});

// ===============================
// DASHBOARD STATS
// ===============================

app.get("/api/stats", auth, async (req, res) => {
  try {
    const emp = await q("SELECT COUNT(*) AS total FROM employees");
    const pay = await q("SELECT COUNT(*) AS total FROM payroll");
    const att = await q("SELECT COUNT(*) AS total FROM attendance");

    res.json({
      employees: emp[0].total,
      payrolls: pay[0].total,
      attendance: att[0].total
    });

  } catch {
    res.status(500).json({ message: "Error loading stats" });
  }
});

// ===============================
// PAYROLL GENERATION (skip duplicates)
// ===============================

app.post("/api/payroll", auth, async (req, res) => {
  const month = new Date().toISOString().slice(0, 7); 

  const employees = await q("SELECT * FROM employees");

  let countNew = 0;

  for (let e of employees) {
    const existing = await q(
      "SELECT id FROM payroll WHERE employee_id=? AND month=?",
      [e.id, month]
    );

    if (existing.length > 0) continue;

    const basic = Number(e.basic_salary);
    const hra = basic * 0.15;
    const da = basic * 0.05;
    const pf = basic * 0.10;
    const tds = basic * 0.03;
    const net = basic + hra + da - pf - tds;

    await q(
      "INSERT INTO payroll(employee_id,month,basic,hra,da,pf,tds,net_salary) VALUES (?,?,?,?,?,?,?,?)",
      [e.id, month, basic, hra, da, pf, tds, net]
    );

    countNew++;
  }

  if (countNew === 0) {
    res.json({ message: "✔ Payroll already generated for all employees this month." });
  } else {
    res.json({ message: `✔ Payroll generated for ${countNew} new employee(s).` });
  }
});

app.get("/api/payroll", auth, async (req, res) => {
  const rows = await q(
    "SELECT p.*, e.name FROM payroll p JOIN employees e ON p.employee_id=e.id ORDER BY p.id DESC"
  );
  res.json({ payrolls: rows });
});

// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✔ Server Running on PORT ${PORT}`);
});
