-- Disable foreign key constraints during setup for smooth insertion
PRAGMA foreign_keys = OFF;

-- Drop existing tables to allow fresh setup
DROP TABLE IF EXISTS poa_requests;
DROP TABLE IF EXISTS poa_request_files;
DROP TABLE IF EXISTS external_doc_verifications;
DROP TABLE IF EXISTS external_doc_files;

-- 1. POA Requests Table
CREATE TABLE poa_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    request_id TEXT NOT NULL UNIQUE,
    principal TEXT NOT NULL,
    category TEXT NOT NULL,
    submitted_date TEXT NOT NULL, -- YYYY-MM-DD for simple sorting
    assigned_agent TEXT,
    status TEXT NOT NULL,
    contact_info TEXT,
    address TEXT,
    expiration_date TEXT,
    description_of_power TEXT
);

-- 2. POA Request Files Table
CREATE TABLE poa_request_files (
    file_id INTEGER PRIMARY KEY AUTOINCREMENT,
    request_id TEXT NOT NULL,
    document_type TEXT NOT NULL,
    file_link TEXT NOT NULL,
    submitted_date TEXT NOT NULL,
    FOREIGN KEY (request_id) REFERENCES poa_requests(request_id)
);

-- 3. External Document Verifications Table
CREATE TABLE external_doc_verifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    request_id TEXT NOT NULL UNIQUE,
    applicant TEXT NOT NULL,
    category TEXT NOT NULL,
    submitted_date TEXT NOT NULL, -- YYYY-MM-DD
    status TEXT NOT NULL,
    contact_info TEXT,
    address TEXT
);

-- 4. External Document Files Table (with rejection info)
CREATE TABLE external_doc_files (
    file_id INTEGER PRIMARY KEY AUTOINCREMENT,
    request_id TEXT NOT NULL,
    document_type TEXT NOT NULL,
    file_link TEXT NOT NULL,
    submitted_date TEXT NOT NULL,
    rejection_reason TEXT,
    comment TEXT,
    FOREIGN KEY (request_id) REFERENCES external_doc_verifications(request_id)
);

-- ******************************************************
-- Mock Data Insertion
-- ******************************************************

-- Mock POA Requests (matching image_ac7215.png)
INSERT INTO poa_requests (request_id, principal, category, submitted_date, assigned_agent, status, contact_info, address, expiration_date, description_of_power) VALUES
('POA-84622', 'Abebe Bikila', 'Property', '2023-10-26', 'Nati Geleta', 'Active', '+251964367384', 'Addis Ababa, Ethiopia', '2024-10-26', 'To sell, lease, or otherwise dispose of real property.'),
('POA-84621', 'Megersa Illicha', 'Vehicle', '2023-10-26', 'Sintayewu Amele', 'Pending', '+251964367385', 'Oromia, Ethiopia', '2025-01-01', 'To buy and sell vehicles on behalf of the principal.'),
('POA-84620', 'Binlam Alela', 'Business', '2023-10-26', 'Badesa Alex', 'Rejected', '+251964367386', 'Tigray, Ethiopia', '2024-05-15', 'To manage all business operations and finances.'),
('POA-84619', 'Ketema Megersa', 'Medical', '2023-10-26', 'Unassigned', 'Active', '+251964367387', 'Amhara, Ethiopia', '2026-10-26', 'To make all healthcare decisions.'),
('POA-84613', 'Megersa Alem', 'Medical', '2023-10-26', 'Unassigned', 'Active', '+251964367388', 'Sidama, Ethiopia', '2025-12-31', 'To consent to or refuse medical treatments.'),
('POA-84612', 'Older Request', 'Property', '2023-09-01', 'Old Agent', 'Active', '+251964367389', 'Afar, Ethiopia', '2024-09-01', 'General property management.');

-- Mock POA Request Files (for POA-84622 only, matching image_ac7253.png)
INSERT INTO poa_request_files (request_id, document_type, file_link, submitted_date) VALUES
('POA-84622', 'POWER OF ATTORNEY', '/files/poa-84622/poa-front.jpg', '2023-10-25'),
('POA-84622', 'ID Front', '/files/poa-84622/id-front.jpg', '2023-10-25'),
('POA-84622', 'ID Back', '/files/poa-84622/id-back.jpg', '2023-10-25');


-- Mock External Document Verifications (matching image_ac72ae.png)
INSERT INTO external_doc_verifications (request_id, applicant, category, submitted_date, status, contact_info, address) VALUES
('POA-84622', 'Abebe Bikila', 'Property', '2023-10-26', 'Verified', '+251964367384', 'Addis Ababa, Ethiopia'),
('POA-84621', 'Megersa Illicha', 'Vehicle', '2023-10-26', 'Pending', '+251964367385', 'Oromia, Ethiopia'),
('POA-84620', 'Binlam Alela', 'Business', '2023-10-26', 'Rejected', '+251964367386', 'Tigray, Ethiopia'),
('POA-84619', 'Ketema Megersa', 'Medical', '2023-10-26', 'Verified', '+251964367387', 'Amhara, Ethiopia'),
('POA-84613', 'Megersa Alem', 'Medical', '2023-10-26', 'Verified', '+251964367388', 'Sidama, Ethiopia');

-- Mock External Document Files (Ensuring every request ID has at least one file)
INSERT INTO external_doc_files (file_id, request_id, document_type, file_link, submitted_date, rejection_reason, comment) VALUES
-- POA-84622 (Verified - Property)
(100, 'POA-84622', 'Title Deed (Verified)', '/files/poa-84622/verified-title.pdf', '2023-10-20', NULL, NULL),

-- POA-84621 (Pending - Vehicle) - Mocked as needing resubmission
(101, 'POA-84621', 'Applicant''s Passport', '/files/poa-84621/passport.pdf', '2023-10-15', NULL, NULL),
(102, 'POA-84621', 'Property Title Deed', '/files/poa-84621/title.pdf', '2023-10-15', 'Scanned copy is blurry and unreadable.', 'Please re-upload a clear, high-resolution scan of the Property Title Deed.'),
(103, 'POA-84621', 'Utility Bill (Proof of Address)', '/files/poa-84621/utility.pdf', '2023-10-14', NULL, NULL),

-- POA-84620 (Rejected - Business)
(104, 'POA-84620', 'Business License', '/files/poa-84620/rejected-license.pdf', '2023-10-10', 'License is expired.', 'Please submit an active and renewed business license.'),

-- POA-84619 (Verified - Medical)
(105, 'POA-84619', 'Medical History Form', '/files/poa-84619/medical-form.pdf', '2023-10-22', NULL, NULL),

-- POA-84613 (Verified - Medical)
(106, 'POA-84613', 'Consent Form', '/files/poa-84613/consent.pdf', '2023-10-21', NULL, NULL);

-- Re-enable foreign key constraints
PRAGMA foreign_keys = ON;