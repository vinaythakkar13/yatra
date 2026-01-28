# Backend Integration Instructions for Admin Dashboard

To support the new Admin Dashboard, the backend needs to provide aggregated data for several infographics. Below are the required API specifications.

## 1. Dashboard Summary Statistics
**Endpoint:** `GET /api/admin/dashboard/stats`
**Query Params:** `yatraId` (UUID)

**Response Structure:**
```json
{
  "totalRegistrations": 1250,
  "totalPeople": 5600,
  "allottedRegistrations": 1100,
  "pendingAllotment": 150,
  "cancelledRegistrations": 45,
  "availableRooms": 150,
  "availableBeds": 400
}
```


## 2. Registration Analytics
**Endpoint:** `GET /api/admin/dashboard/registrations`
**Query Params:** `yatraId` (UUID)

**Response Structure:**
```json
{
  "stateData": [
    { "state": "Maharashtra", "count": 450 },
    { "state": "Gujarat", "count": 320 }
  ],
  "genderData": [
    { "name": "Male", "value": 650 },
    { "name": "Female", "value": 550 }
  ],
  "ageData": [
    { "range": "0-18", "count": 100 },
    { "range": "19-35", "count": 450 },
    { "range": "36-50", "count": 350 },
    { "range": "50+", "count": 150 }
  ],
  "handicapCount": 15
}
```

## 3. Hotel Availability Breakdown
**Endpoint:** `GET /api/admin/dashboard/hotels`
**Query Params:** `yatraId` (UUID)

**Response Structure:**
```json
[
  {
    "name": "Hotel Grand Heritage",
    "totalRooms": 50,
    "availableRooms": 12,
    "totalBeds": 150,
    "availableBeds": 45
  },
  {
    "name": "Serene Residency",
    "totalRooms": 30,
    "availableRooms": 5,
    "totalBeds": 90,
    "availableBeds": 12
  }
]
```

## Integration Checklist
- [ ] Ensure all endpoints accept `yatraId` for filtering.
- [ ] Aggregate `stateData` from traveler addresses.
- [ ] Calculate `availableRooms` and `availableBeds` based on assignments vs capacity.
- [ ] Filter `cancelledRegistrations` by status in the database.
