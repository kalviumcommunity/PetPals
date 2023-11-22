use petpals;

-- Example 1: Retrieve information about adopted pets, including adopter and shelter details

SELECT
    AR.adoption_id,
    P.name AS pet_name,
    A.name AS adopter_name,
    S.name AS shelter_name
FROM
    Adoption_Records AR
JOIN Pets P ON AR.pet_id = P.pet_id
JOIN Adopters A ON AR.adopter_id = A.adopter_id
JOIN Shelters S ON P.shelter_id = S.shelter_id;


-- Example 2: Find the names of adopters who adopted a pet at a specific shelter
SELECT
    A.name AS adopter_name
FROM
    Adoption_Records AR
JOIN Adopters A ON AR.adopter_id = A.adopter_id
WHERE
    AR.pet_id IN (SELECT pet_id FROM Pets WHERE shelter_id = 1);
    
    
    
-- Example 3: Creating an index 
CREATE INDEX idx_adoption_date ON Adoption_Records (adoption_date);

-- Example 4: Query using the indexed column for faster retrieval
SELECT
    adoption_id,
    adoption_date,
    status,
    fees_paid
FROM
    Adoption_Records
WHERE
    adoption_date BETWEEN '2023-01-01' AND '2023-02-01';
    
    
 -- 5
 DROP INDEX idx_adoption_date ON Adoption_Records;
