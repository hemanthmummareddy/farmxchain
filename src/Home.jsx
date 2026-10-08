import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=2000&q=80')"
      }}
    >
      {/* Strong but clean overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">

        <div className="max-w-3xl">

          <h1 className="text-6xl md:text-7xl font-extrabold text-white leading-tight">
            Building the Future of  
            <span className="block text-green-400">
              Agricultural Trade
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-200 leading-relaxed max-w-2xl">
            FarmXChain is an AI-driven agricultural marketplace connecting
            farmers and buyers through intelligent pricing, secure blockchain
            transactions, and transparent supply chain management.
          </p>

          <div className="mt-10 flex gap-6">
            <Link
<<<<<<< HEAD
              to="/login?mode=register"
=======
              to="/register"
>>>>>>> a388ef0ce6e7515e6af06fbce909ca27416d71cf
              className="px-10 py-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="px-10 py-4 border border-white text-white font-semibold rounded-md hover:bg-white hover:text-black transition"
            >
              Login
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Home;
