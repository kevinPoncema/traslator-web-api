const gradientOverlay =
	'bg-gradient-to-br from-[#0f172a] via-[#0b1224] to-[#080f20]';

function NoSportedMssages() {
	return (
		<div
			className="min-h-screen flex items-center justify-center px-6 py-10"
            style={{ backgroundColor: '#171717', color: '#ffffff' }}
		>
			<div className="relative max-w-4xl w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl" style={{ backgroundColor: '#202124' }}>
				<div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-teal-400/5 to-purple-500/10" aria-hidden="true" />
				<div className="relative grid gap-8 md:grid-cols-[1.1fr_0.9fr] p-10 md:p-12">
					<div className="flex flex-col gap-6">
						<div className="inline-flex items-center gap-3 self-start rounded-full bg-white/10 px-4 py-2 text-sm font-semibold tracking-wide text-teal-100 shadow-lg shadow-teal-500/10">
							<span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-300 animate-pulse" />
							Compatibilidad limitada
						</div>

						<div className="flex items-start gap-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-900 shadow-lg shadow-amber-500/30">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
									className="h-7 w-7"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M12 9v4m0 4h.01M10.34 3.5l-7 12.12A1.5 1.5 0 004.66 18.5h14.68a1.5 1.5 0 001.32-2.88l-7-12.12a1.5 1.5 0 00-2.62 0z"
									/>
								</svg>
							</div>
							<div className="space-y-2">
								<h1 className="text-2xl md:text-3xl font-semibold text-white leading-tight">
									La tecnología de este proyecto no es compatible con tu navegador.
								</h1>
								<p className="text-base md:text-lg text-slate-200/90 leading-relaxed">
									Para una experiencia segura y sin interrupciones, te sugerimos abrir esta aplicación en Google Chrome.
								</p>
							</div>
						</div>

						<div className="flex flex-wrap gap-4">
							<a
								href="https://www.google.com/chrome/"
								target="_blank"
								rel="noreferrer"
								className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-teal-400 px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-blue-500/40"
							>
								Descargar Google Chrome
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
									className="h-5 w-5"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M5 12h14m0 0l-5 5m5-5l-5-5"
									/>
								</svg>
							</a>
							<button
								type="button"
								className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-white/90 backdrop-blur transition hover:border-white/30 hover:bg-white/5"
								onClick={() => window.location.reload()}
							>
								Reintentar
								<span className="text-xs font-normal text-white/70">(si ya actualizaste tu navegador)</span>
							</button>
						</div>
					</div>

					<div className="relative">
						<div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" aria-hidden="true" />
						<div className="absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-teal-400/20 blur-3xl" aria-hidden="true" />
						<div className="relative h-full rounded-2xl border border-white/10 bg-white/5 p-6 shadow-inner shadow-black/30">
							<div className="mb-6 flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 text-sm font-semibold text-white/90">
								<span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-teal-400 text-slate-900 shadow-lg shadow-blue-500/40">
									AI
								</span>
								<div>
									<p className="text-xs uppercase tracking-[0.15em] text-slate-300">Proyecto</p>
									<p>Traductor Web</p>
								</div>
							</div>
							<div className="space-y-3 text-sm text-slate-200/90">
								<p className="rounded-2xl bg-white/5 px-4 py-3 leading-relaxed">
									Este proyecto usa capacidades avanzadas del navegador para traducir en tiempo real.
								</p>
								<p className="rounded-2xl bg-white/5 px-4 py-3 leading-relaxed">
									Algunos navegadores no exponen la tecnología necesaria. Chrome ofrece el mejor soporte y estabilidad para esta app.
								</p>
								<p className="rounded-2xl bg-white/5 px-4 py-3 leading-relaxed">
									Si prefieres otro navegador, asegúrate de tener la versión más reciente o prueba nuevamente más tarde.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default NoSportedMssages
