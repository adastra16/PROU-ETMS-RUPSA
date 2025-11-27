# Database Schema Documentation

## Overview
This Employee Management System (EMS) uses **MongoDB** as the database with **Mongoose** as the ODM (Object Document Mapper). The database consists of three main collections: Users, Employees, and Tasks.

**Database Name:** `employee_task_management` (default, configurable via `MONGO_DB_NAME`)

---

## Collections

### 1. Users Collection

**Collection Name:** `users`

**Purpose:** Stores user authentication and account information.

**Schema:**

| Field | Type | Required | Unique | Constraints | Description |
|-------|------|----------|--------|-------------|-------------|
| `_id` | ObjectId | Yes | Yes | Auto-generated | Primary key |
| `username` | String | Yes | No | Trimmed | User's display name |
| `email` | String | Yes | Yes | Lowercase, Trimmed | User's email address (used for login) |
| `password` | String | Yes | No | Hashed | User's password (hashed before storage) |
| `createdAt` | Date | Auto | No | Auto-generated | Timestamp of creation |
| `updatedAt` | Date | Auto | No | Auto-updated | Timestamp of last update |

**Indexes:**
- `email` - Unique index

**Virtual Fields:**
- `id` - Virtual field that maps to `_id` (exposed in JSON responses)

**JSON Transform:**
- Excludes `password` field from JSON output
- Excludes `__v` (version key)
- Maps `_id` to `id`

---

### 2. Employees Collection

**Collection Name:** `employees`

**Purpose:** Stores employee information managed by users.

**Schema:**

| Field | Type | Required | Unique | Constraints | Description |
|-------|------|----------|--------|-------------|-------------|
| `_id` | ObjectId | Yes | Yes | Auto-generated | Primary key |
| `name` | String | Yes | No | Trimmed | Employee's full name |
| `email` | String | Yes | Yes | Lowercase, Trimmed | Employee's email address |
| `role` | String | Yes | No | Trimmed | Employee's job role/title |
| `department` | String | Yes | No | Trimmed | Employee's department |
| `status` | String | No | No | Enum: `['Active', 'Inactive', 'On Leave']` | Employee's current status (default: `'Active'`) |
| `createdBy` | ObjectId | Yes | No | References `User._id` | Foreign key to the user who created this employee |
| `dateCreated` | Date | No | No | Default: `Date.now` | Date when employee record was created |
| `createdAt` | Date | Auto | No | Auto-generated | Timestamp of creation |
| `updatedAt` | Date | Auto | No | Auto-updated | Timestamp of last update |

**Indexes:**
- `email` - Unique index
- `createdBy` - Index for efficient queries (references User collection)

**Relationships:**
- `createdBy` → `users._id` (Many-to-One: Many employees can belong to one user)

**Virtual Fields:**
- `id` - Virtual field that maps to `_id` (exposed in JSON responses)

**JSON Transform:**
- Excludes `__v` (version key)
- Maps `_id` to `id`

---

### 3. Tasks Collection

**Collection Name:** `tasks`

**Purpose:** Stores tasks assigned to employees.

**Schema:**

| Field | Type | Required | Unique | Constraints | Description |
|-------|------|----------|--------|-------------|-------------|
| `_id` | ObjectId | Yes | Yes | Auto-generated | Primary key |
| `title` | String | Yes | No | Trimmed | Task title |
| `description` | String | No | No | Trimmed | Task description/details |
| `dueDate` | Date | Yes | No | - | Task due date |
| `status` | String | No | No | Enum: `['Pending', 'In-progress', 'Completed']` | Task status (default: `'Pending'`) |
| `priority` | String | No | No | Enum: `['Low', 'Medium', 'High']` | Task priority level (default: `'Medium'`) |
| `assignedEmployeeId` | ObjectId | Yes | No | References `Employee._id` | Foreign key to the employee assigned to this task |
| `createdBy` | ObjectId | Yes | No | References `User._id` | Foreign key to the user who created this task |
| `dateCreated` | Date | No | No | Default: `Date.now` | Date when task was created |
| `createdAt` | Date | Auto | No | Auto-generated | Timestamp of creation |
| `updatedAt` | Date | Auto | No | Auto-updated | Timestamp of last update |

**Indexes:**
- `assignedEmployeeId` - Index for efficient queries (references Employee collection)
- `createdBy` - Index for efficient queries (references User collection)
- `status` - Index for filtering tasks by status
- `dueDate` - Index for date-based queries

**Relationships:**
- `assignedEmployeeId` → `employees._id` (Many-to-One: Many tasks can be assigned to one employee)
- `createdBy` → `users._id` (Many-to-One: Many tasks can belong to one user)

**Business Rules:**
- The `assignedEmployeeId` must reference an employee that belongs to the same user as `createdBy` (validated at application level)

**Virtual Fields:**
- `id` - Virtual field that maps to `_id` (exposed in JSON responses)

**JSON Transform:**
- Excludes `__v` (version key)
- Maps `_id` to `id`

---

## Entity Relationship Diagram (ERD)

```
┌─────────────┐
│    Users    │
├─────────────┤
│ _id (PK)    │
│ username    │
│ email (UK)  │
│ password    │
└──────┬──────┘
       │
       │ 1
       │
       │ N
┌──────┴──────┐         ┌─────────────┐
│  Employees  │         │    Tasks    │
├─────────────┤         ├─────────────┤
│ _id (PK)    │         │ _id (PK)    │
│ name        │◄────────│ assigned    │
│ email (UK)  │    N    │ EmployeeId  │
│ role        │         │ (FK)        │
│ department  │         │             │
│ status      │         │ title       │
│ createdBy   │         │ description │
│ (FK)        │         │ dueDate     │
└─────────────┘         │ status      │
                        │ priority    │
                        │ createdBy   │
                        │ (FK)        │
                        └─────────────┘
```

---

## Data Types Reference

### MongoDB Types Used:
- **ObjectId**: MongoDB's unique identifier (12-byte BSON type)
- **String**: UTF-8 encoded string
- **Date**: BSON date type (stores as UTC)
- **Enum**: String with restricted values (enforced by Mongoose)

### Mongoose Features:
- **Timestamps**: Automatically adds `createdAt` and `updatedAt` fields
- **Virtuals**: Computed properties (e.g., `id` mapping to `_id`)
- **Transform**: Custom JSON serialization
- **Refs**: References to other collections for population

---

## Indexes Summary

| Collection | Field(s) | Type | Purpose |
|------------|----------|------|---------|
| `users` | `email` | Unique | Ensure unique email addresses |
| `employees` | `email` | Unique | Ensure unique employee emails |
| `employees` | `createdBy` | Regular | Fast queries by owner |
| `tasks` | `assignedEmployeeId` | Regular | Fast queries by assigned employee |
| `tasks` | `createdBy` | Regular | Fast queries by owner |
| `tasks` | `status` | Regular | Fast filtering by status |
| `tasks` | `dueDate` | Regular | Fast date range queries |

---

## Connection Configuration

**Connection String Format:**
```
mongodb://[host]:[port]/[database]
```

**Default Configuration:**
- Host: `127.0.0.1` (localhost)
- Port: `27017` (MongoDB default)
- Database: `employee_task_management`

**Environment Variables:**
- `MONGO_URI`: Full MongoDB connection string
- `MONGO_DB_NAME`: Database name (overrides default)

---

## Data Validation

### Application-Level Validation:
1. **Email Format**: Validated via Mongoose validators and application logic
2. **Password**: Hashed using bcrypt before storage
3. **Enum Values**: Enforced by Mongoose enum constraints
4. **Referential Integrity**: 
   - Tasks can only reference employees that belong to the same user
   - Validated in service layer before creation/update

### Database-Level Constraints:
- Unique indexes on `users.email` and `employees.email`
- Required fields enforced by Mongoose schema

---

## Sample Queries

### Get all employees for a user:
```javascript
Employee.find({ createdBy: userId })
```

### Get all tasks for an employee:
```javascript
Task.find({ assignedEmployeeId: employeeId })
```

### Get all tasks for a user:
```javascript
Task.find({ createdBy: userId })
```

### Get tasks by status:
```javascript
Task.find({ status: 'Pending', createdBy: userId })
```

### Populate employee details in tasks:
```javascript
Task.find({ createdBy: userId }).populate('assignedEmployeeId')
```

---

## Migration Notes

- All collections use `timestamps: true`, which automatically manages `createdAt` and `updatedAt`
- The `dateCreated` field in Employees and Tasks is separate from `createdAt` and can be manually set
- All `_id` fields are exposed as `id` in JSON responses for API consistency
- Passwords are never included in JSON responses (excluded via transform)

---

## Version History

- **Initial Schema**: Supports user authentication, employee management, and task assignment
- **Multi-tenancy**: All employees and tasks are scoped to users via `createdBy` field
- **Status Management**: Both employees and tasks have status fields for workflow management

