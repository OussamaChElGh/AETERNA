// Aeterna Environment System — Visual Floor Diamond Constants
// These are the VISUAL screen-space corners of the master_floor_asset.png
// when rendered at 940x620px centered at (600, 390) in the 1200x800 stage.
// Derived analytically: for a proper 2:1 isometric diamond,
// width=940px → diamond height = 940/2 = 470px.
// Top vertex: (600, 390-235)=155, Left: (130, 390), Right: (1070, 390), Bottom: (600, 625)

export const VISUAL_FLOOR = {
  centerX: 600,
  centerY: 490,
  imageWidth: 940,
  imageHeight: 620,

  // The four visible corners of the isometric floor diamond (screen space)
  topCorner:    { x: 600,  y: 255 },   // back-center join of both walls
  leftCorner:   { x: 130,  y: 490 },   // far-left diamond vertex
  rightCorner:  { x: 1070, y: 490 },   // far-right diamond vertex
  bottomCorner: { x: 600,  y: 725 },   // front-center diamond vertex
};

// Derived geometry (don't change these — they flow from VISUAL_FLOOR above)
export const ISO_WALL_EDGE_LENGTH = Math.hypot(
  VISUAL_FLOOR.topCorner.x - VISUAL_FLOOR.leftCorner.x,
  VISUAL_FLOOR.topCorner.y - VISUAL_FLOOR.leftCorner.y
); // ≈ 525.5px — the pixel length of each back wall-floor rim edge

// The canonical isometric angle for this scene (arctan(1/2) ≈ 26.57°)
// Positive for NE edge (going down-right), negative for NW edge (going down-left)
export const ISO_ANGLE_DEG = Math.atan2(
  VISUAL_FLOOR.leftCorner.y - VISUAL_FLOOR.topCorner.y,  // 235
  VISUAL_FLOOR.topCorner.x - VISUAL_FLOOR.leftCorner.x   // 470
) * (180 / Math.PI); // ≈ 26.57°
