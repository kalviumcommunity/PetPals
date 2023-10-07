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
module.exports = router;


// 1. First Normal Form (1NF):
// Each table appears to contain only atomic values, and there are no repeating groups or arrays. So, it adheres to 1NF.

// 2. Second Normal Form (2NF):
// To assess 2NF, we need to ensure that non-key attributes are functionally dependent on the entire primary key.
// In the Pets, Adopters, and Shelters tables, the primary keys are single attributes (pet_id, adopter_id, and shelter_id), and the non-key attributes in these tables are functionally dependent on these primary keys. Therefore, it adheres to 2NF.

// 3. Third Normal Form (3NF):
// 3NF requires that non-key attributes are not transitively dependent on the primary key.
// In your schema, you've separated the shelter's location information into its own table (Shelters), eliminating the transitive dependency between shelter_id and location. Therefore, it adheres to 3NF.