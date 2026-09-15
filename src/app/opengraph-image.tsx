import { ImageResponse } from 'next/og';

export const alt = 'P&G Test Prep — pipeline, figure, numerical and data reasoning practice';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Shared social card, inherited by every route that does not define its own. */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#312e81',
          color: '#ffffff',
          padding: '72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: '#ffffff',
              color: '#312e81',
              fontSize: '38px',
              fontWeight: 700,
            }}
          >
            P
          </div>
          <div style={{ fontSize: '30px', color: '#c7d2fe' }}>quiz.ckautoflow.com</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '76px', fontWeight: 700, lineHeight: 1.1 }}>P&amp;G Test Prep</div>
          <div style={{ marginTop: '24px', fontSize: '34px', color: '#c7d2fe', lineHeight: 1.4 }}>
            Pipeline logic · Figure series · Numerical reasoning · Data interpretation
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: '28px', color: '#a5b4fc' }}>
          Solvers, a graded practice bank and worked explanations
        </div>
      </div>
    ),
    size,
  );
}
