import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const BRAND = { ink: '#09090B', gold: '#D4AF37', offwhite: '#F5F5F0', cosmic: '#0ea5e9', muted: '#71717A' };

function formatXP(xp: number): string {
  if (xp >= 1000000) return `${(xp / 1000000).toFixed(1)}M`;
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}K`;
  return xp.toString();
}

function getInitial(name: string): string {
  const trimmed = (name || 'S').trim();
  return trimmed.charAt(0).toUpperCase();
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name') || 'Sabio de ANEKTIA';
  const rank = searchParams.get('rank') || '?';
  const xp = parseInt(searchParams.get('xp') || '0', 10);
  const level = searchParams.get('level') || '1';
  const scope = searchParams.get('scope') === 'weekly' ? 'Semanal' : 'Global';
  const achievements = searchParams.get('achievements') || '0';
  const relics = searchParams.get('relics') || '0';
  const streak = searchParams.get('streak') || '0';
  const avatarUrl = searchParams.get('avatarUrl');

  return new ImageResponse(
    (
      <div style={{
        display: 'flex', flexDirection: 'column', width: 1200, height: 630,
        backgroundColor: BRAND.ink, fontFamily: 'Inter, sans-serif', color: BRAND.offwhite,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.08,
          backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(212,175,55,0.3) 0%, transparent 60%)',
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', padding: '64px 80px', height: '100%', width: '100%' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 48 }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 20, fontWeight: 600, letterSpacing: '0.3em', color: 'rgba(212,175,55,0.6)', textTransform: 'uppercase' }}>
                Ranking {scope}
              </span>
              <span style={{ fontSize: 64, fontWeight: 900, fontFamily: '"Playfair Display", serif', fontStyle: 'italic' }}>
                ANEKTIA
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontSize: 20, fontWeight: 600, letterSpacing: '0.2em', color: 'rgba(245,245,240,0.4)', textTransform: 'uppercase' }}>
                Puesto
              </span>
              <span style={{ fontSize: 96, fontWeight: 900, fontFamily: '"Playfair Display", serif', color: BRAND.gold }}>
                #{rank}
              </span>
            </div>
          </div>

          {/* User info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginBottom: 48 }}>
            <div style={{
              width: 120, height: 120, borderRadius: '50%', border: '3px solid rgba(212,175,55,0.4)',
              overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: 'rgba(212,175,55,0.1)',
            }}>
              {avatarUrl ? (
                <img src={avatarUrl} alt={name} width={120} height={120} style={{ objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: 48, fontWeight: 900, fontFamily: '"Playfair Display", serif', color: BRAND.gold }}>
                  {getInitial(name)}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <span style={{ fontSize: 40, fontWeight: 900, fontFamily: '"Playfair Display", serif', marginBottom: 8 }}>
                {name}
              </span>
              <div style={{ display: 'flex', gap: 32, fontSize: 22, color: 'rgba(245,245,240,0.6)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: BRAND.gold, fontSize: 28 }}>✦</span>
                  Nivel {level}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: BRAND.gold, fontSize: 28 }}>🏆</span>
                  {formatXP(xp)} XP
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 24, marginBottom: 48 }}>
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '20px 24px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)',
              backgroundColor: 'rgba(255,255,255,0.04)',
            }}>
              <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.2em', color: 'rgba(245,245,240,0.4)', textTransform: 'uppercase', marginBottom: 8 }}>
                Logros
              </span>
              <span style={{ fontSize: 32, fontWeight: 900, fontFamily: '"Playfair Display", serif', color: BRAND.gold }}>
                {achievements}
              </span>
            </div>
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '20px 24px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)',
              backgroundColor: 'rgba(255,255,255,0.04)',
            }}>
              <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.2em', color: 'rgba(245,245,240,0.4)', textTransform: 'uppercase', marginBottom: 8 }}>
                Reliquias
              </span>
              <span style={{ fontSize: 32, fontWeight: 900, fontFamily: '"Playfair Display", serif', color: BRAND.gold }}>
                {relics}
              </span>
            </div>
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '20px 24px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)',
              backgroundColor: 'rgba(255,255,255,0.04)',
            }}>
              <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.2em', color: 'rgba(245,245,240,0.4)', textTransform: 'uppercase', marginBottom: 8 }}>
                Racha
              </span>
              <span style={{ fontSize: 32, fontWeight: 900, fontFamily: '"Playfair Display", serif', color: '#fb923c', display: 'flex', alignItems: 'center', gap: 8 }}>
                🔥 {streak}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderTop: '1px solid rgba(212,175,55,0.2)', paddingTop: 24,
          }}>
            <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: '0.3em', color: 'rgba(245,245,240,0.3)', textTransform: 'uppercase' }}>
              anektia.app
            </span>
            <span style={{ fontSize: 28 }}>
              {scope === 'Semanal' ? '👑' : '🏆'}
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, max-age=300',
      },
    }
  );
}
