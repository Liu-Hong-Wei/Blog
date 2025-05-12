function MainContentLayout({ 
  children,
  className
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`w-full h-full bg-gray-50 dark:bg-gray-900 py-4 ${className || ''}`}>
      <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-6 min-h-full`}>
        {children}
      </div>
    </div>
  );
}
export default MainContentLayout;