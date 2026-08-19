import PredictionForm from "../components/PredictionForm";

function HomePage() {
  return (
    <main className="page home-page">
      <section className="hero">
        <div className="hero-badge">Smart property valuation</div>
        <h1>Estimate your house price in seconds.</h1>
        <p>
          Enter the property details and our trained machine-learning pipeline
          will estimate the expected selling price.
        </p>
      </section>

      <PredictionForm />
    </main>
  );
}

export default HomePage;
