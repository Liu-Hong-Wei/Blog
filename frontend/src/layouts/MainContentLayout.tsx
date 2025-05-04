function MainContentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-full bg-gray-50 dark:bg-gray-900 py-4">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="w-full flex flex-col md:flex-row gap-6 min-h-full">
          {children}
        </section>
      </div>
    </div>
  );
}

export default MainContentLayout;