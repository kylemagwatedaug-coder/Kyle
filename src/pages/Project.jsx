import { Link, Navigate, useParams } from "react-router-dom";
import Cover from "../components/Cover.jsx";
import { projects } from "../data/projects.js";

export default function Project() {
  const { slug } = useParams();
  const i = projects.findIndex((p) => p.slug === slug);
  if (i < 0) return <Navigate to="/work" replace />;
  const p = projects[i];
  const next = projects[(i + 1) % projects.length];

  return (
    <main className="detail">
      <header className="work__top">
        <Link to="/work" className="work__brand">Back to projects</Link>
        <p className="work__meta">{p.kind}, {p.year}</p>
        <nav className="work__nav"><Link to="/">Home</Link></nav>
      </header>

      <article className="detail__body">
        <h1>{p.name}</h1>
        <div className="detail__cover"><Cover hue={p.hue} image={p.image} label={p.name} /></div>
        <div className="detail__cols">
          <p className="detail__summary">{p.summary}</p>
          <dl>
            <dt>Built with</dt>
            <dd>{p.stack.join(", ")}</dd>
            <dt>Links</dt>
            <dd className="detail__links">
              <a href={p.repo} target="_blank" rel="noreferrer">GitHub repo</a>
              <a href={p.demo} target="_blank" rel="noreferrer">Live demo</a>
            </dd>
          </dl>
        </div>
        <Link to={`/work/${next.slug}`} className="pill pill--orange">Next: {next.name}</Link>
      </article>
    </main>
  );
}
