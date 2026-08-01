// Aeterna Environment System - IsoCamera Sub-System
// Manages isometric projection, zoom, panning, viewport bounds, and screen<->tile math

export const TILE_WIDTH_HALF = 32;
export const TILE_HEIGHT_HALF = 16;
export const DEFAULT_ORIGIN_X = 600;
export const DEFAULT_ORIGIN_Y = 160;

export class IsoCamera {
  private originX: number;
  private originY: number;
  private zoom: number;
  private minZoom: number;
  private maxZoom: number;

  constructor(
    originX: number = DEFAULT_ORIGIN_X,
    originY: number = DEFAULT_ORIGIN_Y,
    zoom: number = 1.0,
    minZoom: number = 0.6,
    maxZoom: number = 1.5
  ) {
    this.originX = originX;
    this.originY = originY;
    this.zoom = zoom;
    this.minZoom = minZoom;
    this.maxZoom = maxZoom;
  }

  public getZoom(): number {
    return this.zoom;
  }

  public setZoom(zoom: number): void {
    this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, zoom));
  }

  public zoomIn(step: number = 0.1): void {
    this.setZoom(this.zoom + step);
  }

  public zoomOut(step: number = 0.1): void {
    this.setZoom(this.zoom - step);
  }

  public tileToScreen(tileX: number, tileY: number, tileZ: number = 0): { screenX: number; screenY: number } {
    const screenX = (tileX - tileY) * TILE_WIDTH_HALF + this.originX;
    const screenY = (tileX + tileY) * TILE_HEIGHT_HALF - (tileZ * 32) + this.originY;
    return { screenX, screenY };
  }

  public screenToTile(screenX: number, screenY: number, tileZ: number = 0, gridSizeX: number = 32, gridSizeY: number = 32): { tileX: number; tileY: number } {
    const relX = screenX - this.originX;
    const relY = screenY - this.originY + (tileZ * 32);

    const tileX = Math.round((relX / TILE_WIDTH_HALF + relY / TILE_HEIGHT_HALF) / 2);
    const tileY = Math.round((relY / TILE_HEIGHT_HALF - relX / TILE_WIDTH_HALF) / 2);

    return {
      tileX: Math.max(0, Math.min(gridSizeX - 1, tileX)),
      tileY: Math.max(0, Math.min(gridSizeY - 1, tileY))
    };
  }
}
