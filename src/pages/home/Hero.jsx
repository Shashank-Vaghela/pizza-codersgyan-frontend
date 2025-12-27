import { useNavigate } from "react-router-dom";
import heroPizza from "../../assets/img/hero-pizza.png";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-white pb-20 border-b border-gray-200">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Hero Content */}
        <div className="grid md:grid-cols-2 gap-16 items-center mt-12">
          {/* Left Content */}
          <div className="max-w-xl">
            <h1 className="text-[3.5rem] font-extrabold leading-[1.1] text-gray-900 mb-6">
              <span className="whitespace-nowrap">
                Super Delicious Pizza in
              </span>
              <br />
              <span className="text-orange-500">Only 45 Minutes!</span>
            </h1>
            <p className="text-base leading-relaxed text-gray-600 mb-8">
              Enjoy a Free Meal if Your Order Takes More
              <br />
              Than 45 Minutes!
            </p>
            <button 
              onClick={() => navigate("/menu")}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-250 shadow-[0_4px_12px_rgba(255,107,53,0.3)] hover:shadow-[0_6px_20px_rgba(255,107,53,0.4)] hover:-translate-y-0.5"
            >
              Get your pizza now
            </button>
          </div>

          {/* Right Image */}
          <div className="flex justify-center md:justify-end">
            <img
              src={heroPizza}
              alt="Delicious Pizza"
              className="w-full max-w-lg drop-shadow-2xl hover:scale-105 transition-transform duration-500 animate-[fadeInZoom_0.6s_ease-out]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
