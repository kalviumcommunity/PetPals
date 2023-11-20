const express = require('express');
const router = express.Router();
const db = require("../db/conn");

router.get("/createTables", (req, res) => {

  const createTableQueries = [
    `
    CREATE TABLE IF NOT EXISTS Roles (
      role_id INT PRIMARY KEY,
      role_name VARCHAR(255)
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS Shelters (
      shelter_id INT PRIMARY KEY,
      name VARCHAR(255),
      location VARCHAR(255),
      contact_info VARCHAR(255)
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS Pets (
      pet_id INT PRIMARY KEY,
      name VARCHAR(255),
      species VARCHAR(255),
      age INT,
      gender VARCHAR(255),
      breed VARCHAR(255),
      medical_history VARCHAR(255)
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS Adopters (
      adopter_id INT PRIMARY KEY,
      name VARCHAR(255),
      contact_info VARCHAR(255),
      housing_details VARCHAR(255)
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS Adoption_Records (
      adoption_id INT PRIMARY KEY,
      adoption_date DATE,
      status VARCHAR(255),
      fees_paid DECIMAL(10, 2),
      additional_notes VARCHAR(255)
    )
    `
];





  const executeQueries = (queries, index) => {
    if (index >= queries.length) {
      res.send('Tables created successfully');
      return;
    }

    const query = queries[index];
    db.query(query, (err, result) => {
      if (err) {
        console.error(`Error creating table ${index + 1}:`, err);
        res.status(500).send(`Error creating table ${index + 1}`);
      } else {
        console.log(`Table ${index + 1} created successfully`);
        executeQueries(queries, index + 1);
      }
    });
  };

  executeQueries(createTableQueries, 0);
});



router.get("/alterTables", (req, res) => {

  const alterTableQueries = [
    `
    ALTER TABLE Pets
    ADD COLUMN shelter_id INT,
    ADD FOREIGN KEY (shelter_id) REFERENCES Shelters(shelter_id);
    `,
    `ALTER TABLE Shelters 
     ADD COLUMN role_id INT,
     ADD FOREIGN KEY (role_id) REFERENCES Roles(role_id);`,
    `ALTER TABLE Adopters 
     ADD COLUMN role_id INT,
     ADD FOREIGN KEY (role_id) REFERENCES Roles(role_id);`,
    `ALTER TABLE Adoption_Records 
     ADD COLUMN pet_id INT,
     ADD FOREIGN KEY (pet_id) REFERENCES Pets(pet_id);`,
    `ALTER TABLE Adoption_Records 
     ADD COLUMN adopter_id INT,
     ADD FOREIGN KEY (adopter_id) REFERENCES Adopters(adopter_id);`,
];


  const executeQueries = (queries, index) => {
    if (index >= queries.length) {
      res.send('Tables altered successfully');
      return;
    }

    const query = queries[index];
    db.query(query, (err, result) => {
      if (err) {
        console.error(`Error altering table ${index + 1}:`, err);
        res.status(500).send(`Error altering table ${index + 1}`);
      } else {
        console.log(`Table ${index + 1} altered successfully`);
        executeQueries(queries, index + 1);
      }
    });
  };

  executeQueries(alterTableQueries, 0);
});

router.get('/dropTables', (req, res) => {
  const dropTableQueries = [
    'DROP TABLE IF EXISTS Adoption_Records',
    'DROP TABLE IF EXISTS Adoption_Requests',
    'DROP TABLE IF EXISTS Pets',
    'DROP TABLE IF EXISTS Adopters',
    'DROP TABLE IF EXISTS Shelters',
    'DROP TABLE IF EXISTS Roles',
  ];

  const executeQueries = (queries, index) => {
    if (index >= queries.length) {
      res.send('Tables dropped successfully');
      return;
    }

    const query = queries[index];
    db.query(query, (err, result) => {
      if (err) {
        console.error(`Error dropping table ${index + 1}:`, err);
        res.status(500).send(`Error dropping table ${index + 1}`);
      } else {
        console.log(`Table ${index + 1} dropped successfully`);
        executeQueries(queries, index + 1);
      }
    });
  };

  executeQueries(dropTableQueries, 0);
});

  router.get('/getAdopters', (req, res) => {
    db.query('SELECT name,role_id FROM Adopters', (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error fetching adopters');
      } else {
        console.log(result, 'adopters fetched');
        res.json(result);
      }
    });
  });

  router.put('/setRoles/:name/:roleID', (req, res) => {
    const { name, roleID } = req.params;
  
    const { password } = req.body;
  
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }
  
    let createUserSQL = `CREATE USER '${name}'@'localhost' IDENTIFIED BY '${password}'`;
    // let createUserSQL = `DROP '${name}'@'localhost'`;

    db.query(createUserSQL, (createUserErr, createUserResult) => {
      if (createUserErr) {
        console.log(createUserErr);
        return res.status(500).send('Error creating user');
      }
  
      let sql = '';
      if (roleID === '1') {
        sql = `GRANT ALL PRIVILEGES ON petpals.* TO '${name}'@'localhost'`;
      } else if (roleID === '2') {
        sql = `GRANT SELECT, INSERT, UPDATE, DELETE ON petpals.* TO '${name}'@'localhost'`;
      } else if (roleID === '3') {
        sql = `GRANT SELECT ON petpals.* TO '${name}'@'localhost'`;
      } else {
        return res.status(400).json({ error: 'Invalid role ID' });
      }
  
      db.query(sql, (grantErr, grantResult) => {
        if (grantErr) {
          console.log(grantErr);
          res.status(500).send('Error setting roles');
        } else {
          console.log(`Privileges granted for ${name}`);
          res.json({ message: `Privileges granted for ${name}` });
        }
      });
    });
  });
  
  module.exports = router;
  


