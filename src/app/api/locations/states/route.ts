import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch states from the third-party API
    const response = await fetch('https://india-location-hub.in/api/locations/states', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Return the data with CORS headers
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching states:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch states',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

