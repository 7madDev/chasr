import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatAmount } from "@/lib/format";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://open.announcify.app";

export default async function EmbedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const goal = await prisma.goal.findUnique({ where: { slug } });
  if (!goal) notFound();

  const range = goal.targetAmount - goal.startAmount;
  const progress = range > 0
    ? Math.min(Math.max(((goal.currentAmount - goal.startAmount) / range) * 100, 0), 100)
    : 0;

  const clampedProgress = Math.round(progress);
  const isHit = goal.status === "HIT";
  const goalUrl = `${APP_URL}/goals/${slug}`;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --bg: #ffffff;
                --bg-hover: #fafafa;
                --border: #e5e5e5;
                --text-main: #171717;
                --text-muted: #737373;
                --text-faint: #a3a3a3;
                
                --accent-text: #C13D19;
                --accent-bg: #FFF5F2;
                --accent-border: #FADCD5;
                
                --track: #f5f5f5;
                --bar-fill: linear-gradient(90deg, #C13D19, #E85D38);
                
                --hit-text: #16a34a;
                --hit-bg: #f0fdf4;
                --hit-border: #bbf7d0;
                --hit-fill: #22c55e;
              }
              
              @media (prefers-color-scheme: dark) {
                :root {
                  --bg: #121315;
                  --bg-hover: #17181a;
                  --border: #23292E;
                  --text-main: #fafafa;
                  --text-muted: #a1a1aa;
                  --text-faint: #52525b;
                  
                  --accent-text: #E85D38;
                  --accent-bg: rgba(193, 61, 25, 0.15);
                  --accent-border: rgba(193, 61, 25, 0.3);
                  
                  --track: #23292E;
                  
                  --hit-text: #4ade80;
                  --hit-bg: rgba(34, 197, 94, 0.1);
                  --hit-border: rgba(34, 197, 94, 0.2);
                }
              }

              * { margin: 0; padding: 0; box-sizing: border-box; }
              
              html, body {
                height: 100vh;
                width: 100vw;
                background: transparent;
                overflow: hidden;
              }

              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                padding: 0;
              }

              .widget {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                height: 100%;
                width: 100%;
                padding: 16px 20px;
                background: var(--bg);
                border: 1px solid var(--border);
                border-radius: 16px;
                text-decoration: none;
                transition: background 0.2s ease, border-color 0.2s ease;
                cursor: pointer;
              }

              .widget:hover {
                background: var(--bg-hover);
                border-color: var(--text-faint);
              }

              .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
              }

              .title {
                font-size: 15px;
                font-weight: 800;
                color: var(--text-main);
                letter-spacing: -0.02em;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 65%;
              }

              .pill {
                font-size: 9px;
                font-weight: 800;
                text-transform: uppercase;
                letter-spacing: 0.15em;
                padding: 4px 8px;
                border-radius: 6px;
                color: ${isHit ? 'var(--hit-text)' : 'var(--accent-text)'};
                background: ${isHit ? 'var(--hit-bg)' : 'var(--accent-bg)'};
                border: 1px solid ${isHit ? 'var(--hit-border)' : 'var(--accent-border)'};
              }

              .mono {
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
              }

              .metrics {
                display: flex;
                align-items: baseline;
                gap: 6px;
                margin-top: auto;
                margin-bottom: 10px;
              }

              .current {
                font-size: 32px;
                font-weight: 900;
                letter-spacing: -0.04em;
                color: var(--text-main);
                line-height: 1;
              }

              .target {
                font-size: 14px;
                font-weight: 700;
                color: var(--text-muted);
              }

              .progress-bg {
                width: 100%;
                height: 6px;
                background: var(--track);
                border-radius: 999px;
                overflow: hidden;
                margin-bottom: 12px;
              }

              .progress-fill {
                height: 100%;
                background: ${isHit ? 'var(--hit-fill)' : 'var(--bar-fill)'};
                border-radius: 999px;
                transition: width 1s cubic-bezier(0.16, 1, 0.3, 1);
              }

              .footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
              }

              .pct {
                font-size: 9px;
                font-weight: 800;
                text-transform: uppercase;
                letter-spacing: 0.15em;
                color: ${isHit ? 'var(--hit-text)' : 'var(--text-muted)'};
              }

              .brand {
                font-size: 9px;
                font-weight: 800;
                text-transform: uppercase;
                letter-spacing: 0.2em;
                color: var(--text-faint);
                transition: color 0.2s ease;
              }

              .widget:hover .brand {
                color: var(--text-main);
              }
            `,
          }}
        />
      </head>
      <body>
        <a href={goalUrl} target="_blank" rel="noopener noreferrer" className="widget">
          <div className="header">
            <span className="title">{goal.productName}</span>
            <span className="pill">{goal.status}</span>
          </div>

          <div className="metrics mono">
            <span className="current">{formatAmount(goal.currentAmount, goal.currency)}</span>
            <span className="target">/ {formatAmount(goal.targetAmount, goal.currency)}</span>
          </div>

          <div className="progress-bg">
            <div
              className="progress-fill"
              style={{ width: `${Math.max(clampedProgress, 2)}%` }}
            />
          </div>

          <div className="footer">
            <span className="pct mono">{clampedProgress}% complete</span>
            <span className="brand">
              chasr ↗
            </span>
          </div>
        </a>
      </body>
    </html>
  );
}