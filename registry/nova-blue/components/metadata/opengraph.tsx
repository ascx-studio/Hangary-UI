import { ImageResponse } from "next/og";

export const alt = "Rajeev Puri - Software Engineer";

export const size = {
	width: 1200,
	height: 630,
};

export const contentType = "image/png";

export default async function Image() {
	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					alignItems: "stretch",
					justifyContent: "space-between",
					background:
						"radial-gradient(circle at top left, rgba(255,255,255,0.18), transparent 34%), linear-gradient(135deg, #050505 0%, #0b0b0d 45%, #111216 100%)",
					color: "white",
					fontFamily: "Inter, Arial, sans-serif",
					padding: 48,
					position: "relative",
				}}
			>
				<div
					style={{
						position: "absolute",
						inset: 0,
						opacity: 0.18,
						background:
							"linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
						backgroundSize: "48px 48px",
						maskImage:
							"radial-gradient(circle at center, black 42%, transparent 100%)",
					}}
				/>

				<div
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "space-between",
						width: "100%",
						height: "100%",
						position: "relative",
						zIndex: 1,
					}}
				>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							fontSize: 22,
							letterSpacing: "0.18em",
							textTransform: "uppercase",
							color: "rgba(255,255,255,0.72)",
						}}
					>
						<span>Rajeev Puri</span>
						<span>Software Engineer</span>
					</div>

					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: 24,
							maxWidth: 820,
						}}
					>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: 12,
								fontSize: 20,
								fontWeight: 600,
								color: "rgba(255,255,255,0.8)",
							}}
						>
							<span
								aria-hidden="true"
								style={{
									width: 12,
									height: 12,
									borderRadius: 9999,
									background: "#d4af37",
									boxShadow: "0 0 0 6px rgba(212,175,55,0.12)",
								}}
							>
								•
							</span>
							<span>London, UK</span>
						</div>

						<h1
							style={{
								fontSize: 72,
								lineHeight: 0.95,
								fontWeight: 800,
								letterSpacing: "-0.05em",
								maxWidth: 860,
								margin: 0,
							}}
						>
							Full-Stack Engineer
							<br />
							Next.js, React & TypeScript
						</h1>

						<p
							style={{
								fontSize: 28,
								lineHeight: 1.35,
								maxWidth: 760,
								margin: 0,
								color: "rgba(255,255,255,0.74)",
							}}
						>
							Building high-performance web apps, scalable systems, and clean digital experiences.
						</p>
					</div>

					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							fontSize: 18,
							color: "rgba(255,255,255,0.66)",
						}}
					>
						<span>rajeevpuri.com.np</span>
						<span>Portfolio · Blog · Projects</span>
					</div>
				</div>
			</div>
		),
		{
			...size,
		}
	);
}
