// Aeterna Environment System - SpatialGrid Sub-System
// Manages spatial indexing, floor masks, footprint checking, and collision validation

import { EnvironmentLayout, EnvironmentPlacedItem, PlacementValidationResult, AssetMetadata } from '@/types/environmentEngine';

export class SpatialGrid {
  private layout: EnvironmentLayout;

  constructor(layout: EnvironmentLayout) {
    this.layout = layout;
  }

  public isFloorCell(tileX: number, tileY: number): boolean {
    if (tileX < 0 || tileX >= this.layout.gridSizeX || tileY < 0 || tileY >= this.layout.gridSizeY) return false;
    const cell = this.layout.cells[tileX]?.[tileY];
    return cell?.type === 'floor' && !this.layout.blockedTiles.has(`${tileX},${tileY}`);
  }

  public isWallCell(tileX: number, tileY: number): boolean {
    if (tileX < 0 || tileX >= this.layout.gridSizeX || tileY < 0 || tileY >= this.layout.gridSizeY) return false;
    const cell = this.layout.cells[tileX]?.[tileY];
    return cell?.type === 'wall';
  }

  public validateFootprint(
    targetTileX: number,
    targetTileY: number,
    targetTileZ: number,
    rotation: 0 | 90 | 180 | 270,
    metadata: AssetMetadata,
    currentInstanceId: string | null,
    placedItems: EnvironmentPlacedItem[]
  ): PlacementValidationResult {
    const rawW = metadata.footprint.tileWidth;
    const rawH = metadata.footprint.tileHeight;

    const effectiveW = (rotation === 90 || rotation === 270) ? rawH : rawW;
    const effectiveH = (rotation === 90 || rotation === 270) ? rawW : rawH;

    const invalidTiles: { tileX: number; tileY: number }[] = [];

    for (let dx = 0; dx < effectiveW; dx++) {
      for (let dy = 0; dy < effectiveH; dy++) {
        const cx = targetTileX + dx;
        const cy = targetTileY + dy;

        // 1. Surface Type Match
        if (metadata.placementSurface === 'floor') {
          if (!this.isFloorCell(cx, cy)) {
            invalidTiles.push({ tileX: cx, tileY: cy });
          }
        } else if (metadata.placementSurface === 'wall') {
          if (!this.isWallCell(cx, cy)) {
            invalidTiles.push({ tileX: cx, tileY: cy });
          }
        }

        // 2. Surface Elevation Support
        if (targetTileZ > 0 || metadata.placementSurface === 'desk') {
          const hasSupportTable = placedItems.some(item => {
            if (item.instanceId === currentInstanceId) return false;
            if (item.tileZ !== 0) return false;
            // Check if item is furniture with Z=0 under cx, cy
            return cx >= item.tileX && cx < item.tileX + 2 &&
                   cy >= item.tileY && cy < item.tileY + 2;
          });

          if (!hasSupportTable) {
            invalidTiles.push({ tileX: cx, tileY: cy });
          }
        }

        // 3. Same TileZ Collisions
        const isColliding = placedItems.some(item => {
          if (item.instanceId === currentInstanceId) return false;
          if (item.tileZ !== targetTileZ) return false;
          return cx >= item.tileX && cx < item.tileX + 1 &&
                 cy >= item.tileY && cy < item.tileY + 1;
        });

        if (isColliding) {
          invalidTiles.push({ tileX: cx, tileY: cy });
        }
      }
    }

    return {
      isValid: invalidTiles.length === 0,
      reason: invalidTiles.length > 0 ? (metadata.placementSurface === 'wall' ? 'wall_mismatch' : 'out_of_floor') : undefined,
      invalidTiles
    };
  }
}
