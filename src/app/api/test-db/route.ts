import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    return NextResponse.json({
      success: true,
      message: 'Conexión a MongoDB exitosa',
      database: 'helpdeskpro',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Error al conectar con MongoDB',
        error: error.message,
      },
      { status: 500 }
    );
  }
}






