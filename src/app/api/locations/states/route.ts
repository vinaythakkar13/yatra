import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const data = [
            {
                "code": "35",
                "created_at": "2025-08-27T18:54:30.341Z",
                "districts": 3,
                "id": 171,
                "name": "ANDAMAN & NICOBAR ISLANDS",
                "talukas": 9,
                "villages": 556
            },
            {
                "code": "28",
                "created_at": "2025-08-27T18:54:30.532Z",
                "districts": 23,
                "id": 177,
                "name": "ANDHRA PRADESH",
                "talukas": 1128,
                "villages": 28008
            },
            {
                "code": "12",
                "created_at": "2025-08-27T18:54:30.571Z",
                "districts": 16,
                "id": 202,
                "name": "ARUNACHAL PRADESH",
                "talukas": 188,
                "villages": 5569
            },
            {
                "code": "18",
                "created_at": "2025-08-27T18:54:30.571Z",
                "districts": 27,
                "id": 201,
                "name": "ASSAM",
                "talukas": 185,
                "villages": 26181
            },
            {
                "code": "10",
                "created_at": "2025-08-27T18:54:30.534Z",
                "districts": 38,
                "id": 179,
                "name": "BIHAR",
                "talukas": 534,
                "villages": 42442
            },
            {
                "code": "04",
                "created_at": "2025-08-27T18:54:30.535Z",
                "districts": 1,
                "id": 180,
                "name": "CHANDIGARH",
                "talukas": 1,
                "villages": 12
            },
            {
                "code": "22",
                "created_at": "2025-08-27T18:54:30.539Z",
                "districts": 18,
                "id": 183,
                "name": "CHHATTISGARH",
                "talukas": 149,
                "villages": 19600
            },
            {
                "code": "26",
                "created_at": "2025-08-27T18:54:30.539Z",
                "districts": 1,
                "id": 182,
                "name": "DADRA & NAGAR HAVELI",
                "talukas": 1,
                "villages": 70
            },
            {
                "code": "25",
                "created_at": "2025-08-27T18:54:30.532Z",
                "districts": 2,
                "id": 176,
                "name": "DAMAN & DIU",
                "talukas": 2,
                "villages": 25
            },
            {
                "code": "30",
                "created_at": "2025-08-27T18:54:30.527Z",
                "districts": 2,
                "id": 172,
                "name": "GOA",
                "talukas": 11,
                "villages": 397
            },
            {
                "code": "24",
                "created_at": "2025-08-27T18:54:30.527Z",
                "districts": 26,
                "id": 174,
                "name": "GUJARAT",
                "talukas": 225,
                "villages": 18474
            },
            {
                "code": "06",
                "created_at": "2025-08-27T18:54:30.541Z",
                "districts": 21,
                "id": 185,
                "name": "HARYANA",
                "talukas": 74,
                "villages": 6927
            },
            {
                "code": "02",
                "created_at": "2025-08-27T18:54:30.547Z",
                "districts": 12,
                "id": 188,
                "name": "HIMACHAL PRADESH",
                "talukas": 117,
                "villages": 20692
            },
            {
                "code": "01",
                "created_at": "2025-08-27T18:54:30.537Z",
                "districts": 22,
                "id": 181,
                "name": "JAMMU & KASHMIR",
                "talukas": 82,
                "villages": 6655
            },
            {
                "code": "20",
                "created_at": "2025-08-27T18:54:30.556Z",
                "districts": 24,
                "id": 193,
                "name": "JHARKHAND",
                "talukas": 260,
                "villages": 31229
            },
            {
                "code": "29",
                "created_at": "2025-08-27T18:54:30.556Z",
                "districts": 30,
                "id": 192,
                "name": "KARNATAKA",
                "talukas": 180,
                "villages": 28648
            },
            {
                "code": "32",
                "created_at": "2025-08-27T18:54:30.547Z",
                "districts": 14,
                "id": 187,
                "name": "KERALA",
                "talukas": 63,
                "villages": 1494
            },
            {
                "code": "31",
                "created_at": "2025-08-27T18:54:30.560Z",
                "districts": 1,
                "id": 195,
                "name": "LAKSHADWEEP",
                "talukas": 10,
                "villages": 27
            },
            {
                "code": "23",
                "created_at": "2025-08-27T18:54:30.576Z",
                "districts": 50,
                "id": 203,
                "name": "MADHYA PRADESH",
                "talukas": 342,
                "villages": 53483
            },
            {
                "code": "27",
                "created_at": "2025-08-27T18:54:30.565Z",
                "districts": 35,
                "id": 197,
                "name": "MAHARASHTRA",
                "talukas": 357,
                "villages": 43282
            },
            {
                "code": "14",
                "created_at": "2025-08-27T18:54:30.578Z",
                "districts": 9,
                "id": 204,
                "name": "MANIPUR",
                "talukas": 38,
                "villages": 2607
            },
            {
                "code": "17",
                "created_at": "2025-08-27T18:54:30.534Z",
                "districts": 7,
                "id": 178,
                "name": "MEGHALAYA",
                "talukas": 39,
                "villages": 6782
            },
            {
                "code": "15",
                "created_at": "2025-08-27T18:54:30.568Z",
                "districts": 8,
                "id": 198,
                "name": "MIZORAM",
                "talukas": 29,
                "villages": 830
            },
            {
                "code": "13",
                "created_at": "2025-08-27T18:54:30.555Z",
                "districts": 11,
                "id": 191,
                "name": "NAGALAND",
                "talukas": 114,
                "villages": 1435
            },
            {
                "code": "07",
                "created_at": "2025-08-27T18:54:30.527Z",
                "districts": 9,
                "id": 173,
                "name": "NCT OF DELHI",
                "talukas": 27,
                "villages": 222
            },
            {
                "code": "21",
                "created_at": "2025-08-27T18:54:30.568Z",
                "districts": 30,
                "id": 200,
                "name": "ODISHA",
                "talukas": 478,
                "villages": 50558
            },
            {
                "code": "34",
                "created_at": "2025-08-27T18:54:30.549Z",
                "districts": 4,
                "id": 189,
                "name": "PUDUCHERRY",
                "talukas": 8,
                "villages": 95
            },
            {
                "code": "03",
                "created_at": "2025-08-27T18:54:30.544Z",
                "districts": 20,
                "id": 186,
                "name": "PUNJAB",
                "talukas": 77,
                "villages": 12715
            },
            {
                "code": "08",
                "created_at": "2025-08-27T18:54:30.565Z",
                "districts": 33,
                "id": 196,
                "name": "RAJASTHAN",
                "talukas": 244,
                "villages": 44004
            },
            {
                "code": "11",
                "created_at": "2025-08-27T18:54:30.550Z",
                "districts": 4,
                "id": 190,
                "name": "SIKKIM",
                "talukas": 9,
                "villages": 452
            },
            {
                "code": "33",
                "created_at": "2025-08-27T18:54:30.530Z",
                "districts": 32,
                "id": 175,
                "name": "TAMIL NADU",
                "talukas": 216,
                "villages": 16268
            },
            {
                "code": "16",
                "created_at": "2025-08-27T18:54:30.541Z",
                "districts": 4,
                "id": 184,
                "name": "TRIPURA",
                "talukas": 44,
                "villages": 901
            },
            {
                "code": "05",
                "created_at": "2025-08-27T18:54:30.558Z",
                "districts": 13,
                "id": 194,
                "name": "UTTARAKHAND",
                "talukas": 78,
                "villages": 16413
            },
            {
                "code": "19",
                "created_at": "2025-08-27T18:54:30.568Z",
                "districts": 19,
                "id": 199,
                "name": "WEST BENGAL",
                "talukas": 360,
                "villages": 40414
            }
        ];

        return NextResponse.json({ success: true, states: [...data], total: data?.length || 0 });

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}