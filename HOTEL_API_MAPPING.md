# Hotel API Mapping Documentation

## API Endpoint
```
POST http://localhost:5000/api/hotels
```

## Required Fields (from API)

Based on the curl example, the following fields are **required** to be sent to the server:

### ✅ Fields Present in Form & API
1. **yatra** (UUID string) - ✅ Mapped from `yatraId` in form
2. **name** - ✅ Present in form
3. **address** - ✅ Present in form
4. **hotelType** - ✅ Present in form (A, B, C, D)
5. **managerName** - ✅ Present in form
6. **managerContact** - ✅ Present in form
7. **hasElevator** - ✅ Present in form (boolean)
8. **totalFloors** - ✅ Present in form (number)
9. **floors** - ✅ Present in form (array)
10. **rooms** - ✅ Generated from floors data

### ⚠️ Optional Fields (in form but not in API curl example)

These fields are in the form but **not shown in the API curl example**. They may or may not be accepted by the backend:

1. **mapLink** - Optional in form, included in payload if present
2. **distanceFromBhavan** - Optional in form, included in payload if present
3. **numberOfDays** - Present in form, included in payload
4. **startDate** - Present in form, included in payload
5. **endDate** - Present in form, included in payload
6. **checkInTime** - Present in form, included in payload
7. **checkOutTime** - Present in form, included in payload

## Data Transformation

### Form Data Structure → API Payload Structure

**Form Data:**
```typescript
{
  yatraId: string,
  name: string,
  address: string,
  hotelType: 'A' | 'B' | 'C' | 'D',
  managerName: string,
  managerContact: string,
  hasElevator: boolean,
  totalFloors: number,
  floors: FloorData[],
  // ... other fields
}
```

**API Payload:**
```typescript
{
  yatra: string,  // ← mapped from yatraId
  name: string,
  address: string,
  hotelType: 'A' | 'B' | 'C' | 'D',
  managerName: string,
  managerContact: string,
  hasElevator: boolean,
  totalFloors: number,
  floors: FloorRequest[],
  rooms: RoomRequest[],  // ← generated from floors
  // ... optional fields
}
```

### Rooms Generation

Rooms are generated from floors configuration:
- Each floor has `roomNumbers` array and `rooms` array
- For each non-empty `roomNumber`, a `RoomRequest` is created
- Floor number 'G' is converted to 0, others parsed as integers
- Room configuration (toiletType, numberOfBeds, chargePerDay) comes from `rooms` array

## Missing Fields Analysis

### Fields in API curl but NOT in form:
**None** - All required API fields are present in the form.

### Fields in form but NOT in API curl:
These fields are included in the payload but may need backend confirmation:

1. **mapLink** - Google Maps link (optional)
2. **distanceFromBhavan** - Distance in kilometers (optional)
3. **numberOfDays** - Duration of stay (optional)
4. **startDate** - Hotel contract start date (optional)
5. **endDate** - Hotel contract end date (optional)
6. **checkInTime** - Check-in time (optional)
7. **checkOutTime** - Check-out time (optional)

**Recommendation:** Verify with backend team if these fields should be included or removed from the payload.

## Implementation

The transformation is handled by `transformHotelFormDataToApiPayload()` function in `/src/services/hotelApi.ts`.

The function:
1. Maps `yatraId` → `yatra`
2. Generates `rooms` array from `floors` configuration
3. Transforms `floors` structure
4. Includes optional fields if present
5. Returns properly formatted `CreateHotelRequest`

## Usage

```typescript
import { useCreateHotelMutation, transformHotelFormDataToApiPayload } from '@/services/hotelApi';

const [createHotel] = useCreateHotelMutation();

const handleSubmit = async (formData: HotelFormData) => {
  const apiPayload = transformHotelFormDataToApiPayload(formData, formData.yatraId);
  const result = await createHotel(apiPayload).unwrap();
  // Handle success/error
};
```
