import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

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

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: goal.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const goalUrl = `${APP_URL}/goals/${slug}`;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: #fff;
                padding: 12px 16px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                height: 80px;
                overflow: hidden;
              }
              .top {
                display: flex;
                justify-content: space-between;
                align-items: baseline;
                margin-bottom: 6px;
              }
              .name {
                font-size: 13px;
                font-weight: 600;
                color: #1c1917;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 180px;
              }
              .pct {
                font-size: 12px;
                font-weight: 600;
                font-family: ui-monospace, monospace;
                color: #F59E0B;
              }
              .bar-bg {
                width: 100%;
                height: 6px;
                background: #f5f5f4;
                border-radius: 3px;
                overflow: hidden;
                margin-bottom: 6px;
              }
              .bar-fill {
                height: 100%;
                background: #F59E0B;
                border-radius: 3px;
                transition: width 0.3s;
              }
              .bottom {
                display: flex;
                justify-content: space-between;
                align-items: center;
              }
              .amounts {
                font-size: 11px;
                font-family: ui-monospace, monospace;
                color: #78716c;
              }
              .brand a {
                font-size: 10px;
                color: #a8a29e;
                text-decoration: none;
              }
              .brand a:hover { text-decoration: underline; }
            `,
          }}
        />
      </head>
      <body>
        <div className="top" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
          <span className="name" style={{ fontSize: "13px", fontWeight: 600, color: "#1c1917", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "180px" }}>
            {goal.productName}
          </span>
          <span className="pct" style={{ fontSize: "12px", fontWeight: 600, fontFamily: "ui-monospace, monospace", color: "#F59E0B" }}>
            {Math.round(progress)}%
          </span>
        </div>
        <div style={{ width: "100%", height: "6px", background: "#f5f5f4", borderRadius: "3px", overflow: "hidden", marginBottom: "6px" }}>
          <div
            style={{
              height: "100%",
              width: `${Math.round(progress)}%`,
              background: goal.status === "HIT" ? "linear-gradient(90deg, #fbbf24, #4ade80)" : "#F59E0B",
              borderRadius: "3px",
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "11px", fontFamily: "ui-monospace, monospace", color: "#78716c" }}>
            {currencyFormatter.format(goal.currentAmount)} / {currencyFormatter.format(goal.targetAmount)}
          </span>
          <span style={{ fontSize: "10px" }}>
            <a
              href={goalUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#a8a29e", textDecoration: "none" }}
            >
              Chasing on Chasr ↗
            </a>
          </span>
        </div>
      </body>
    </html>
  );
}
