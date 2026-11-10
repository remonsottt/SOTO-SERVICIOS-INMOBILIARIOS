import React from 'react';
import { Star } from 'lucide-react';

const GoogleReviews = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const existingScript = document.querySelector('script[src="https://elfsightcdn.com/platform.js"]');

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://elfsightcdn.com/platform.js';
      script.async = true;
      script.onload = () => {
        setIsLoading(false);
      };
      script.onerror = () => {
        console.error('Failed to load Elfsight widget');
        setIsLoading(false);
      };
      document.body.appendChild(script);
    } else {
      setIsLoading(false);
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-gray-900 mb-3">
            Reseñas en Google
          </h3>
          <div className="flex items-center justify-center gap-2 text-yellow-500">
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <span className="ml-2 text-gray-700 font-semibold text-sm">4.5/5</span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#223e28]"></div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg">
            <div
              className="elfsight-app-8ee7d4e8-3b77-4b40-9247-df6301cfcbd7"
              data-elfsight-app-lazy
            ></div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GoogleReviews;
