import { ImageResponse } from "@vercel/og";
import { prisma } from "@/lib/prisma";
import { formatAmount } from "@/lib/format";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const goal = await prisma.goal.findUnique({ where: { slug } });
  if (!goal) {
    return new Response("Not found", { status: 404 });
  }

  const range = goal.targetAmount - goal.startAmount;
  const progress = range > 0
    ? Math.min(Math.max(((goal.currentAmount - goal.startAmount) / range) * 100, 0), 100)
    : 0;

  // formatting handled by formatAmount inline

  const isHit = goal.status === "HIT";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #fafaf9 0%, #f5f5f4 100%)",
          fontFamily: "system-ui, sans-serif",
          padding: "60px",
        }}
      >
        {/* Top branding */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "16px",
              height: "16px",
              backgroundColor: "#F59E0B",
              transform: "rotate(45deg)",
            }}
          />
          <span style={{ fontSize: "18px", color: "#78716c", fontWeight: 500 }}>
            Chasr
          </span>
        </div>

        {/* Product name */}
        <h1
          style={{
            fontSize: "48px",
            fontWeight: 700,
            color: "#1c1917",
            marginBottom: "8px",
            textAlign: "center",
          }}
        >
          {goal.productName}
        </h1>

        <p
          style={{
            fontSize: "20px",
            color: "#78716c",
            marginBottom: "40px",
          }}
        >
          by {goal.founderName}
        </p>

        {/* Progress bar */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "600px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              marginBottom: "12px",
            }}
          >
            <span
              style={{
                fontSize: "24px",
                fontWeight: 600,
                fontFamily: "monospace",
                color: "#1c1917",
              }}
            >
              {formatAmount(goal.currentAmount, goal.currency)}
            </span>
            <span
              style={{
                fontSize: "24px",
                fontFamily: "monospace",
                color: "#a8a29e",
              }}
            >
              / {formatAmount(goal.targetAmount, goal.currency)}
            </span>
          </div>

          <div
            style={{
              width: "100%",
              height: "24px",
              backgroundColor: "#e7e5e4",
              borderRadius: "12px",
              overflow: "hidden",
              display: "flex",
            }}
          >
            <div
              style={{
                width: `${Math.round(progress)}%`,
                height: "100%",
                borderRadius: "12px",
                background: isHit
                  ? "linear-gradient(90deg, #fbbf24, #4ade80)"
                  : "#F59E0B",
              }}
            />
          </div>

          <span
            style={{
              fontSize: "32px",
              fontWeight: 700,
              fontFamily: "monospace",
              color: isHit ? "#15803d" : "#F59E0B",
              marginTop: "16px",
            }}
          >
            {isHit ? "🎉 " : ""}
            {Math.round(progress)}%
          </span>
        </div>

        {/* Footer branding */}
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span style={{ fontSize: "14px", color: "#a8a29e" }}>
            Powered by Announcify
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
