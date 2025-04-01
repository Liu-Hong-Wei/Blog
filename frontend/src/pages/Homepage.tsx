function Homepage() {
  return (
    <>
      <div className="w-full min-h-full flex justify-center">
        <section className="w-full max-w-[1200px] flex flex-col md:flex-row min-h-full">
          <main className="w-full md:w-[742px] p-4 bg-amber-50">
            <h1 className="mb-4">
              U know what,{" "}
              <a
                href="https://teahour.dev"
                className="text-blue-600 hover:underline"
              >
                teahour
              </a>{" "}
              is the best Chinese podcast I've listened.
            </h1>
            <img
              src="https://m.media-amazon.com/images/M/MV5BZTkyMWZjMmQtYzczZC00MmQxLTg0YzctMDAwMDYyMTAxNmEwXkEyXkFqcGc@._V1_.jpg"
              alt="Movie The Dreamers"
              className="w-full max-w-md mx-auto my-4"
            />
          </main>
          <aside className="w-full md:w-[458px] p-4 bg-yellow-200">
            <p>
              <img
                src="https://m.media-amazon.com/images/M/MV5BZTkyMWZjMmQtYzczZC00MmQxLTg0YzctMDAwMDYyMTAxNmEwXkEyXkFqcGc@._V1_.jpg"
                alt="Movie The Dreamers"
                className="w-full max-w-[300px] mx-auto"
              />
            </p>
          </aside>
        </section>
      </div>
    </>
  );
}
export default Homepage;
