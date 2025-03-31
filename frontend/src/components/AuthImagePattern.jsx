const AuthImagePattern = ({
  title = "Welcome to ChatApp!",
  subtitle = "Connect with your friends seamlessly.",
}) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-300 p-12 relative overflow-hidden">
      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-primary/15 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-12 h-12 bg-primary/25 rounded-full blur-lg animate-pulse"></div>

      <div className="max-w-md text-center text-base-content z-10">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-xl bg-primary/10 flex items-center justify-center transform transition-all duration-500 hover:bg-primary/20 hover:shadow-lg`}
            />
          ))}
        </div>
        <h2 className="text-3xl font-bold mb-4 text-primary">{title}</h2>
        <p className="text-lg opacity-80">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
