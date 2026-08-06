import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const ASSETS_FILE = path.join(process.cwd(), 'data', 'assets.json');

export async function GET() {
  try {
    const data = await fs.readFile(ASSETS_FILE, 'utf-8');
    const assets = JSON.parse(data);
    return NextResponse.json(assets.assets || []);
  } catch (error) {
    console.error('Error reading assets:', error);
    return NextResponse.json({ error: 'Error reading assets' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await fs.readFile(ASSETS_FILE, 'utf-8');
    const assets = JSON.parse(data);
    
    const newAsset = {
      ...body,
      id: `asset_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    assets.assets.push(newAsset);
    await fs.writeFile(ASSETS_FILE, JSON.stringify(assets, null, 2));
    
    return NextResponse.json(newAsset);
  } catch (error) {
    console.error('Error creating asset:', error);
    return NextResponse.json({ error: 'Error creating asset' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Asset ID required' }, { status: 400 });
    }
    
    const data = await fs.readFile(ASSETS_FILE, 'utf-8');
    const assets = JSON.parse(data);
    
    const asset = assets.assets.find((a: any) => a.id === id);
    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }
    
    assets.assets = assets.assets.filter((a: any) => a.id !== id);
    await fs.writeFile(ASSETS_FILE, JSON.stringify(assets, null, 2));
    
    return NextResponse.json({ success: true, asset });
  } catch (error) {
    console.error('Error deleting asset:', error);
    return NextResponse.json({ error: 'Error deleting asset' }, { status: 500 });
  }
}
